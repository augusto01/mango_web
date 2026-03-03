import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authProvider';
import { Box, Typography, Button } from '@mui/material';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import ErrorAlert from '../components/Alerts/ErrorAlert';
import '../styles/Login.css';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUser: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.emailOrUser, form.password);
    } catch (err) {
      setError('Credenciales incorrectas. Verificá tus datos.');
      setOpenError(true);
    }
  };

  return (
    <Box className="login-night-wrapper">
      {/* Luces de ambiente sutiles */}
      <div className="bg-glow-orange"></div>

      <Box className="glass-login-card">
        {/* LOGO EN LUGAR DE TEXTO */}
        <Box className="login-logo-wrapper">
          <img 
            src="/img/mangocompleto.png" 
            alt="Logo Mango" 
            className="login-brand-logo" 
          />
          <div className="logo-shadow-glow"></div>
        </Box>


        <form onSubmit={handleSubmit} className="club-form">
          <div className="custom-input-group">
            <FiMail className="input-icon" />
            <input
              type="text"
              name="emailOrUser"
              placeholder="Email o Usuario"
              value={form.emailOrUser}
              onChange={handleChange}
              required
            />
          </div>

          <div className="custom-input-group">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* BOTÓN CON DISEÑO DE EVENTOS */}
          <Button type="submit" className="btn-industrial-buy">
            INICIAR SESIÓN
          </Button>

          <Box className="login-options">
            <Typography onClick={() => navigate('/register')}>
              ¿No tenés cuenta? <span>Registrate</span>
            </Typography>
          </Box>
        </form>
      </Box>

      <ErrorAlert open={openError} onClose={() => setOpenError(false)} message={error} />
    </Box>
  );
};

export default Login;