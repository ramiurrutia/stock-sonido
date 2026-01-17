import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.put("/items/:code/status", async (req, res) => {
  const { status } = req.body;
  const code = req.params.code;
  try {
    const { rows } = await pool.query(
      "UPDATE items SET status = $1 WHERE code = $2",
      [status, code],
    );

    await pool.query(
      `
  INSERT INTO movements (item_id, action, previous_status, new_status, user_name)
  VALUES ($1, 'status_change', $2, $3, $4)
`,
      [itemId, oldStatus, newStatus, userName],
    );

    res.json("El estado se cambió correctamente a: " + status);
  } catch (error) {
    console.error("Error al cambiar de estado:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/items/search", async (req, res) => {
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
  LIMIT 5
  `,
      [`%${q}%`],
    );

    res.json(rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/items/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const { rows } = await pool.query("SELECT * FROM items WHERE code = $1", [
      code,
    ]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json(error);
  }
});

export default router;
