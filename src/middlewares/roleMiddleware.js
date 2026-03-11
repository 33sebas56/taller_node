export const roleMiddleware = (rolRequerido) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado"
      });
    }

    if (req.usuario.rol !== rolRequerido) {
      return res.status(403).json({
        mensaje: "Acceso denegado: rol insuficiente"
      });
    }

    next();
  };
};