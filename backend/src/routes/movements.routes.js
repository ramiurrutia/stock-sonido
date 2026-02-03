import express from "express";
import { pool } from "../db.js";
import { auth } from "../middlewares/auth.js";
import { checkPermission } from "../middlewares/checkPermission.js";

const router = express.Router();

router.get("/stats", auth, checkPermission("admin.access"), async (req, res) => {
  try {
    const query = `
      SELECT 
        -- Total de items que NO son Anvils
        COUNT(CASE WHEN category != 'Anvil' THEN 1 END) ::int as "totalItems",
        
        -- Conteos por estado (Excluyendo Anvils)
        COUNT(CASE WHEN status = 'Guardado' AND category != 'Anvil' THEN 1 END) ::int as "guardados",
        COUNT(CASE WHEN status = 'Enviado' AND category != 'Anvil' THEN 1 END) ::int as "enviados",
        COUNT(CASE WHEN status = 'En Uso' AND category != 'Anvil' THEN 1 END) ::int as "enUso",
        COUNT(CASE WHEN status = 'Baja' AND category != 'Anvil' THEN 1 END) ::int as "baja",
        
        -- Total de Anvils (Suponiendo que se identifican por categoría)
        COUNT(CASE WHEN category = 'Anvil' THEN 1 END) ::int as "totalAnvils"
      FROM items;
    `;

    const result = await pool.query(query);
    
    const stats = result.rows[0];

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

router.get("/logs", auth, checkPermission("admin.access"), async (req, res) => {
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
