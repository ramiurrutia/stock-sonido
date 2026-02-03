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
    req.userId = decoded.userId; // ✅ Cambiar decoded.id por decoded.userId
    next();
  });
};

// Endpoint para obtener permisos actualizados
router.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Obtener permisos del usuario
     const result = await pool.query(
      `SELECT u.id, u.username, u.email, 
              array_agg(DISTINCT p.code) as permissions
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN role_permissions rp ON ur.role_id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = $1
       GROUP BY u.id, u.username, u.email`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      permissions: result.rows[0].permissions || [],
    });
  } catch (error) {
    console.error("Error en /auth/me:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});


router.post("/auth/google", async (req, res) => {
  const { email, googleId, name } = req.body;
  console.log("AUTH GOOGLE BODY:", req.body);

  if (!email || !googleId || !name) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const userResult = await pool.query(
      `
      SELECT id, email
      FROM users
      WHERE google_id = $1 OR email = $2
      `,
      [googleId, email],
    );

    let userId;

    if (userResult.rowCount === 0) {
      const insertUser = await pool.query(
        `
        INSERT INTO users (email, google_id, username, active)
        VALUES ($1, $2, $3, true)
        RETURNING id
        `,
        [email, googleId, name],
      );

      userId = insertUser.rows[0].id;

      await pool.query(
        `
        INSERT INTO user_roles (user_id, role_id)
        SELECT $1, r.id
        FROM roles r
        WHERE r.name = 'viewer'
        `,
        [userId],
      );
    } else {
      userId = userResult.rows[0].id;
    }

    const permissionsResult = await pool.query(
      `
      SELECT DISTINCT p.code
      FROM permissions p
      JOIN role_permissions rp ON rp.permission_id = p.id
      JOIN user_roles ur ON ur.role_id = rp.role_id
      WHERE ur.user_id = $1
      `,
      [userId],
    );

    const permissions = permissionsResult.rows.map((r) => r.code);

    const token = jwt.sign(
      {
        userId,
        email,
        name,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      user: {
        id: userId,
        email,
        name,
        permissions,
      },
    });
  } catch (err) {
    console.error("Auth Google error:", err);
    return res.status(500).json({ error: "Error interno" });
  }
});

export default router;
