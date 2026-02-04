import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.userId = decoded.userId;
    req.userPermissions = decoded.permissions || [];
    next();
  });
};

const requireAdminPermission = (req, res, next) => {
  if (!req.userPermissions.includes('admin.access')) {
    return res.status(403).json({ error: 'Permiso denegado' });
  }
  next();
};

// GET: Obtener todos los usuarios
router.get("/admin/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.username,
        u.active,
        u.created_at,
        array_agg(DISTINCT r.name) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id, u.email, u.username, u.active, u.created_at
      ORDER BY u.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// PUT: Cambiar rol de un usuario
router.put("/admin/users/:userId/role", async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['viewer', 'operator', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    // Eliminar roles actuales
    await pool.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);

    // Asignar nuevo rol
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = $2`,
      [userId, role]
    );

    res.json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;