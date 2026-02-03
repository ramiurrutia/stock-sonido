export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: "Sin permiso" });
    }

    next();
  };
};
