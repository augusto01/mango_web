const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

// Middleware para validar token recibido en headers Authorization
exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: "error", message: "Token no proporcionado" });
  }

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const payload = jwt.verify(token, secret); // verifica y valida expiración automáticamente
    req.user = payload;
    next();
  } catch (error) {
    console.error("Error en auth middleware:", error);
    return res.status(401).json({ status: "error", message: "Token inválido o expirado" });
  }
};

// Función para crear (firmar) token JWT
exports.createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    rol: user.rol,
    active: user.active,
    cel: user.cel,
    empresa: {
      _id: user.empresa._id,
      nombre: user.empresa.nombre,
      direccion: user.empresa.direccion,
      telefono: user.empresa.telefono,
      email: user.empresa.email,
      estado: user.empresa.estado,
      fechaCreacion: user.empresa.fechaCreacion
    }
  };

  return jwt.sign(payload, secret, { expiresIn: '30d' }); // Token válido 30 días
};
