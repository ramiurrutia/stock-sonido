// items.routes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.put("/items/:code/status", async (req, res) => {
  const { status } = req.body;
  const code = req.params.code;
  try {
    const { rows } = await pool.query(
      "UPDATE items SET status = $1 WHERE code = $2",
      [status, code]
    );
    res.json("El estado se cambió correctamente a: " + status)
  } catch (error) {
    console.error("Error al cambiar de estado:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/items/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const { rows } = await pool.query("SELECT * FROM items WHERE code = $1", [code]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json(error);
  }
});

router.get("/items", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM items");
    res.send(rows)
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error" });
  }
});

export default router;
