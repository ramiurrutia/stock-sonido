import express from "express";
import { pool } from "../db.js";
import { auth } from "../middlewares/auth.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const router = express.Router();

router.get("/anvils/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const anvilCheck = await pool.query(
      `SELECT * FROM items WHERE code = $1 AND category = 'Anvil'`,
      [code],
    );

    if (anvilCheck.rows.length === 0) {
      return res.status(404).json({ error: "Anvil not found" });
    }

    const anvil = anvilCheck.rows[0];

    const itemsResult = await pool.query(
      `SELECT 
        i.id,
        i.code,
        i.name,
        i.category,
        i.status,
        i.image_url,
        i.notes,
        ac.notes as content_notes,
        ac.moved_at,
        ac.created_at as added_at
      FROM anvil_contents ac
      JOIN items i ON ac.item_id = i.id
      WHERE ac.anvil_id = $1
      ORDER BY ac.created_at DESC`,
      [anvil.id],
    );

    res.json({
      anvil: {
        id: anvil.id,
        code: anvil.code,
        name: anvil.name,
        status: anvil.status,
        image_url: anvil.image_url,
        notes: anvil.notes,
        created_at: anvil.created_at,
      },
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching anvil contents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/anvils/add", auth, checkPermission("anvil.add_item"), async (req, res) => {
  try {
    const { anvil_id, item_id, notes } = req.body;

    const anvilCheck = await pool.query(
      `SELECT * FROM items WHERE id = $1 AND category = 'Anvil'`,
      [anvil_id],
    );

    if (anvilCheck.rows.length === 0) {
      return res.status(404).json({ error: "Anvil not found" });
    }

    const itemCheck = await pool.query(`SELECT * FROM items WHERE id = $1`, [
      item_id,
    ]);

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const existingContent = await pool.query(
      `SELECT * FROM anvil_contents WHERE item_id = $1`,
      [item_id],
    );

    if (existingContent.rows.length > 0) {
      return res.status(400).json({
        error: "Item is already in another anvil",
        current_anvil_id: existingContent.rows[0].anvil_id,
      });
    }

    const result = await pool.query(
      `INSERT INTO anvil_contents (anvil_id, item_id, notes, moved_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [anvil_id, item_id, notes || null],
    );

    await pool.query(
      `INSERT INTO movements (item_id, anvil_id, action, new_status)
       VALUES ($1, $2, 'assign_anvil', 'Guardado')`,
      [item_id, anvil_id],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding item to anvil:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/anvils/:anvilId/items/:itemId", auth, checkPermission("anvil.remove_item"), async (req, res) => {
  try {
    const { anvilId, itemId } = req.params;

    const existingContent = await pool.query(
      `SELECT * FROM anvil_contents WHERE anvil_id = $1 AND item_id = $2`,
      [anvilId, itemId],
    );

    if (existingContent.rows.length === 0) {
      return res.status(404).json({ error: "Item not found in this anvil" });
    }

    await pool.query(
      `DELETE FROM anvil_contents WHERE anvil_id = $1 AND item_id = $2`,
      [anvilId, itemId],
    );

    await pool.query(
      `INSERT INTO movements (item_id, anvil_id, action, new_status)
       VALUES ($1, $2, 'remove_anvil', 'Guardado')`,
      [itemId, anvilId],
    );

    res.json({ message: "Item removed from anvil successfully" });
  } catch (error) {
    console.error("Error removing item from anvil:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/anvils/:code/status", auth, checkPermission("item.change_status"), async (req, res) => {
  const { code } = req.params;
  const { status: newStatus } = req.body;
  const userName = req.user.name;
  const validStatuses = ["Guardado", "En uso", "Enviado", "Baja"];

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const anvilResult = await client.query(
      `SELECT id, code, status
       FROM items
       WHERE code = $1 AND category = 'Anvil'
       FOR UPDATE`,
      [code],
    );

    if (anvilResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Anvil not found" });
    }

    const anvil = anvilResult.rows[0];

    const anvilItemsResult = await client.query(
      `SELECT i.id, i.code, i.status
       FROM anvil_contents ac
       JOIN items i ON ac.item_id = i.id
       WHERE ac.anvil_id = $1
       FOR UPDATE`,
      [anvil.id],
    );

    const targets = [anvil, ...anvilItemsResult.rows];
    let updatedCount = 0;

    for (const target of targets) {
      const previousStatus = target.status;
      if (previousStatus === newStatus) continue;

      await client.query(
        `UPDATE items
         SET status = $1
         WHERE id = $2`,
        [newStatus, target.id],
      );

      await client.query(
        `INSERT INTO movements (item_id, anvil_id, action, previous_status, new_status, user_name)
         VALUES ($1, $2, 'status_change', $3, $4, $5)`,
        [target.id, anvil.id, previousStatus, newStatus, userName],
      );

      updatedCount += 1;
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      anvil_code: code,
      status: newStatus,
      updated_count: updatedCount,
      items_affected: anvilItemsResult.rows.length,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating anvil and item statuses:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

router.get("/anvils", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        id,
        code,
        name,
        status,
        image_url,
        notes,
        created_at,
        (SELECT COUNT(*) FROM anvil_contents WHERE anvil_id = items.id) as items_count
      FROM items 
      WHERE category = 'Anvil'
      ORDER BY created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching anvils:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
