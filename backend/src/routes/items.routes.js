import express from "express";
import { pool } from "../db.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const allowedCategories = [
  "Cable",
  "Consola",
  "Microfono",
  "Parlante",
  "Potencia",
  "Tripode",
  "Electricidad",
  "Accesorio",
  "Anvil",
];

const allowedStatuses = ["Guardado", "En uso", "Enviado", "Baja"];

router.get(
  "/items",
  async (req, res) => {
    try {
      const { rows } = await pool.query(
        `
        SELECT id, code, name, category, status, image_url, notes, created_at
        FROM items
        WHERE category != 'Anvil'
        ORDER BY category DESC
        `
      );

      res.json(rows);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/items/:code/status",
  auth,
  checkPermission("item.change_status"),
  async (req, res) => {
    const { status, destination } = req.body;
    const { code } = req.params;
    const userName = req.user.name;

    const client = await pool.connect();

    try {
      if (status === "Enviado" && (!destination || !String(destination).trim())) {
        return res.status(400).json({ error: "Destino requerido para estado Enviado" });
      }

      await client.query("BEGIN");

      const { rows: currentItem } = await client.query(
        "SELECT id, status FROM items WHERE code = $1",
        [code]
      );

      if (!currentItem.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Item no encontrado" });
      }

      const itemId = currentItem[0].id;
      const oldStatus = currentItem[0].status;

      await client.query(
        "UPDATE items SET status = $1 WHERE code = $2",
        [status, code]
      );

      await client.query(
        `
        INSERT INTO movements (item_id, action, previous_status, new_status, user_name, notes)
        VALUES ($1, 'status_change', $2, $3, $4, $5)
        `,
        [itemId, oldStatus, status, userName, status === "Enviado" ? `Enviado a: ${destination}` : null]
      );

      if (status === "Enviado") {
        const shipmentResult = await client.query(
          `
          INSERT INTO shipments (destination, contact_name, contact_phone, notes)
          VALUES ($1, NULL, NULL, $2)
          RETURNING id
          `,
          [destination, `Generado por cambio de estado de item ${code}`]
        );

        await client.query(
          `
          INSERT INTO shipment_items (shipment_id, item_id, quantity, notes)
          VALUES ($1, $2, 1, $3)
          `,
          [shipmentResult.rows[0].id, itemId, `Item ${code}`]
        );
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "El estado se cambio correctamente a: " + status,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error al cambiar de estado:", error);
      res.status(500).json({ error: "Error en el servidor" });
    } finally {
      client.release();
    }
  }
);

router.post(
  "/items",
  auth,
  checkPermission("admin.access"),
  async (req, res) => {
    const { code, name, category, status, image_url, notes } = req.body;

    if (!code || !name || !category) {
      return res.status(400).json({ error: "code, name y category son obligatorios" });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Categoria invalida" });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado invalido" });
    }

    try {
      const { rows } = await pool.query(
        `
        INSERT INTO items (code, name, category, status, image_url, notes)
        VALUES ($1, $2, $3, COALESCE($4, 'Guardado'), $5, $6)
        RETURNING id, code, name, category, status, image_url, notes, created_at
        `,
        [code, name, category, status || null, image_url || null, notes || null]
      );

      await pool.query(
        `
        INSERT INTO movements (item_id, action, new_status, user_name, notes)
        VALUES ($1, 'manual_update', $2, $3, $4)
        `,
        [rows[0].id, rows[0].status, req.user.name, "Item creado"]
      );

      res.status(201).json(rows[0]);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "El codigo del item ya existe" });
      }

      console.error("Error creating item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/items/search",
  async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    try {
      const { rows } = await pool.query(
        `
        SELECT id, code, name, status
        FROM items
        WHERE code ILIKE $1
           OR name ILIKE $1
        ORDER BY
          CASE
            WHEN code ILIKE $2 THEN 0
            WHEN name ILIKE $2 THEN 1
            WHEN code ILIKE $1 THEN 2
            ELSE 3
          END,
          name ASC
        LIMIT 10
        `,
        [`%${q}%`, `${q}%`]
      );

      res.json(rows);
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Search failed" });
    }
  }
);

router.get(
  "/items/:code",
  async (req, res) => {
    const { code } = req.params;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM items WHERE code = $1",
        [code]
      );

      if (!rows[0]) {
        return res.status(404).json({ error: "Item not found" });
      }

      const item = rows[0];

      const anvilResult = await pool.query(
        `
        SELECT i.id, i.code, i.name
        FROM anvil_contents ac
        JOIN items i ON ac.anvil_id = i.id
        WHERE ac.item_id = $1
        `,
        [item.id]
      );

      const shipmentResult = await pool.query(
        `
        SELECT s.destination
        FROM shipment_items si
        JOIN shipments s ON s.id = si.shipment_id
        WHERE si.item_id = $1
        ORDER BY s.sent_at DESC, s.id DESC
        LIMIT 1
        `,
        [item.id]
      );

      res.json({
        ...item,
        anvil: anvilResult.rows[0] || null,
        destination: shipmentResult.rows[0]?.destination || null,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/items/:code",
  auth,
  checkPermission("item.edit"),
  async (req, res) => {
    const { code } = req.params;
    const { notes } = req.body;

    try {
      const { rows } = await pool.query(
        "UPDATE items SET notes = $1 WHERE code = $2 RETURNING *",
        [notes, code]
      );

      if (!rows[0]) {
        return res.status(404).json({ error: "Item not found" });
      }

      await pool.query(
        `
        INSERT INTO movements (item_id, action, new_status, user_name)
        VALUES ($1, 'manual_update', $2, $3)
        `,
        [rows[0].id, rows[0].status, req.user.name]
      );

      res.json(rows[0]);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
