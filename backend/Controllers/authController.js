const User = require("../Models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { emailOrUser, password } = req.body;

  try {
    // 1. Buscamos al usuario por email o username (sin populate de empresa)
    const user = await User.findOne({
      $or: [
        { email: emailOrUser.toLowerCase().trim() }, 
        { username: emailOrUser.trim() }
      ],
    });

    // 2. Si no existe el usuario, cortamos acá
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Comparamos la contraseña con bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 4. Verificamos si la cuenta está activa
    if (!user.active) {
      return res.status(403).json({ message: 'Cuenta desactivada. Contacte al administrador.' });
    }

    // 5. Creamos el payload con los datos esenciales del usuario
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      rol: user.rol,
      cel: user.cel
    };

    // 6. Firmamos el token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // 7. Respuesta exitosa
    res.status(200).json({ 
      status: "success",
      token,
      user: {
        name: user.name,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error("ERROR_EN_LOGIN:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};