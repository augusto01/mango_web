import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authProvider';
import '../styles/Login.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import ErrorAlert from '../components/Alerts/ErrorAlert';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUser: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.emailOrUser, form.password);
    } catch (err) {
      console.error('Error durante el login:', err);
      
      if (err.status === 403) {
        setError('Tu cuenta está inactiva. Renová la membresía para continuar.');
      } else {
        setError(err.message || 'Email/Usuario o contraseña incorrectos');
      }

      setOpenError(true);
    }

};



  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar sesión</h2>

        <div className="mb-3">
          <label htmlFor="emailOrUser">Email o usuario</label>
          <input
            type="text"
            id="emailOrUser"
            name="emailOrUser"
            value={form.emailOrUser}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 password-input">
          <label htmlFor="password">Contraseña</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
        </div>

        <button type="submit" className="login-btn">Ingresar</button>
      </form>

      <ErrorAlert
        open={openError}
        onClose={() => setOpenError(false)}
        message={error}
      />
    </div>
  );
};

export default Login;