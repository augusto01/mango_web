const bcrypt = require('bcryptjs');
const User = require('../models/Usuario');

const register = async (req, res) => {
  const params = req.body;

  if (!params.email || !params.password || !params.empresa) {
    return res.status(400).json({
      status: "error",
      message: "Email, contraseña y empresa son requeridos"
    });
  }

  try {
    // Verificar si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email: params.email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "El email ya está registrado"
      });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(params.password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      ...params,
      email: params.email.toLowerCase(),
      password: hashedPassword
    });

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "Registro exitoso",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        rol: savedUser.rol,
        empresa: savedUser.empresa
      }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

module.exports = {
  register
};
