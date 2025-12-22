// items.routes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/items", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Error fetching items" });
  }
});

router.post("/scan", async (req, res) => {
  const { code } = req.body;

  console.log(req.body);
  try {
    const { rows } = await pool.query("SELECT * FROM items WHERE code = $1", [
      code,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error scanning item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
