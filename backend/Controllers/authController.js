const User = require("../Models/Usuario");
const bcrypt = require("bcrypt");
const { createToken } = require("../services/jwt_service");

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { emailOrUser, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUser }, { username: emailOrUser }],
    }).populate('empresa');

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'Renová la membresía para continuar' });
    }

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      rol: user.rol,
      active: user.active,
      cel: user.cel,
      empresa: {
        id: user.empresa._id,
        nombre: user.empresa.nombre,
        direccion: user.empresa.direccion,
        telefono: user.empresa.telefono,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
