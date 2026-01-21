import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/logs", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, i.name as item_name, i.code as item_code 
       FROM movements m 
       JOIN items i ON m.item_id = i.id 
       ORDER BY m.created_at DESC LIMIT 20`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
