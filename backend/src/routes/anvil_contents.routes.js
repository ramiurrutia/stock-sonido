import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET: Obtener anvil con todos sus items
router.get("anvils/:anvilId", async (req, res) => {
  try {
    const { anvilId } = req.params;

    // Verificar que sea un anvil válido
    const anvilCheck = await pool.query(
      `SELECT * FROM items WHERE id = $1 AND category = 'Anvil'`,
      [anvilId],
    );

    if (anvilCheck.rows.length === 0) {
      return res.status(404).json({ error: "Anvil not found" });
    }

    const anvil = anvilCheck.rows[0];

    // Obtener todos los items dentro del anvil
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
      [anvilId],
    );

    // Respuesta estructurada
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

// POST: Agregar item a un anvil
router.post("anvils/", async (req, res) => {
  try {
    const { anvil_id, item_id, notes } = req.body;

    // Verificar que el anvil existe y es categoría Anvil
    const anvilCheck = await pool.query(
      `SELECT * FROM items WHERE id = $1 AND category = 'Anvil'`,
      [anvil_id],
    );

    if (anvilCheck.rows.length === 0) {
      return res.status(404).json({ error: "Anvil not found" });
    }

    // Verificar que el item existe
    const itemCheck = await pool.query(`SELECT * FROM items WHERE id = $1`, [
      item_id,
    ]);

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Verificar que el item no esté ya en otro anvil
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

    // Insertar en anvil_contents
    const result = await pool.query(
      `INSERT INTO anvil_contents (anvil_id, item_id, notes, moved_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [anvil_id, item_id, notes || null],
    );

    // Registrar movimiento
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

// DELETE: Quitar item de un anvil
router.delete("anvils/:anvilId/items/:itemId", async (req, res) => {
  try {
    const { anvilId, itemId } = req.params;

    // Verificar que existe la relación
    const existingContent = await pool.query(
      `SELECT * FROM anvil_contents WHERE anvil_id = $1 AND item_id = $2`,
      [anvilId, itemId],
    );

    if (existingContent.rows.length === 0) {
      return res.status(404).json({ error: "Item not found in this anvil" });
    }

    // Eliminar de anvil_contents
    await pool.query(
      `DELETE FROM anvil_contents WHERE anvil_id = $1 AND item_id = $2`,
      [anvilId, itemId],
    );

    // Registrar movimiento
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

router.get("/anvils", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM items WHERE category = 'Anvil'`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching anvils:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
