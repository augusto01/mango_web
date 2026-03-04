import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authProvider';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import ErrorAlert from '../components/Alerts/ErrorAlert';
import '../styles/Login.css';

const Login = () => {
  // Extraemos loading del context para controlar el botón
  const { login, user, loading } = useAuth();
  
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUser: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openError, setOpenError] = useState(false);

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Usamos los datos del estado 'form'
      await login(form.emailOrUser, form.password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setOpenError(true);
    }
  };

  return (
    <Box className="login-night-wrapper">
      {/* Luces de ambiente sutiles */}
      <div className="bg-glow-orange"></div>

      <Box className="glass-login-card">
        {/* LOGO */}
        <Box className="login-logo-wrapper">
          <img 
            src="/img/mangocompleto.png" 
            alt="Logo Mango" 
            className="login-brand-logo" 
          />
          <div className="logo-shadow-glow"></div>
        </Box>

        <form onSubmit={handleSubmit} className="club-form">
          {/* INPUT USUARIO/EMAIL */}
          <div className="custom-input-group">
            <FiMail className="input-icon" />
            <input
              type="text"
              name="emailOrUser"
              placeholder="Email o Usuario"
              value={form.emailOrUser}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* INPUT CONTRASEÑA */}
          <div className="custom-input-group">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
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

          {/* BOTÓN CON PREVENCIÓN DE DOBLE CLIC */}
          <Button 
            type="submit" 
            className="btn-industrial-buy"
            disabled={loading}
            sx={{ position: 'relative' }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Cargando...
              </Box>
            ) : (
              "INICIAR SESIÓN"
            )}
          </Button>

          <Box className="login-options">
            <Typography onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
              ¿No tenés cuenta? <span>Registrate</span>
            </Typography>
          </Box>
        </form>
      </Box>

      {/* Alerta de Error */}
      <ErrorAlert 
        open={openError} 
        onClose={() => setOpenError(false)} 
        message={error} 
      />
    </Box>
  );
};

export default Login;