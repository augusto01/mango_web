import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, LinearProgress } from '@mui/material';
import { FiMaximize, FiPlusCircle, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';
import { FaBolt, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../../../context/authProvider';
import Navbar from '../../components/Layout/Navbar';
import '../../styles/HomeRoles.css'; 

const HomeVendedor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || user?.username || 'Staff_User';

  // Datos de rendimiento del vendedor (Metas personales)
  const statsVendedor = {
    objetivo: 100,
    vendidosHoy: 65,
    comisionAcumulada: 12500 // Opcional para motivar al staff
  };

  const actions = [
    { title: "ESCANEAR QR", desc: "Validación rápida de acceso", icon: <FiMaximize />, path: "/escaner", category: "live" },
    { title: "VENDER ENTRADAS", desc: "Emisión de nuevos tickets", icon: <FiPlusCircle />, path: "/ventas", category: "live" },
    { title: "VALIDAR MANUAL", desc: "Búsqueda por DNI o código", icon: <FiCheckSquare />, path: "/validar-manual" },
    { title: "MIS VENTAS", desc: "Reporte de ventas hoy", icon: <FiTrendingUp />, path: "/mis-reportes" },
  ];

  return (
    <div className="home-dashboard-wrapper">
      <Navbar />
      <div className="home-glow-bg"></div>
      
      <div className="container home-content-z" style={{ paddingTop: '100px' }}>
        
        {/* HEADER BIENVENIDA */}
        <header className="home-welcome-header">
          <div className="welcome-text-box">
            <Typography variant="h6" className="system-status">
              <span className="blink">●</span> OPERATIVE_MODE // STAFF_ROOT
            </Typography>
            <h1 className="welcome-title">HOLA, {userName.toUpperCase()}</h1>
          </div>
          <button className="quick-scan-btn" onClick={() => navigate('/escaner')}>
              <FaQrcode /> <span>FAST_SCAN</span>
          </button>
        </header>

        {/* SECCIÓN HERO: MI RENDIMIENTO HOY */}
        <div className="next-event-hero vendedor-hero" onClick={() => navigate('/mis-reportes')}>
          <div className="hero-header">
            <div className="event-info">
              <span className="label-tech"><FaBolt /> MY_PERFORMANCE_TODAY</span>
              <h2 className="event-name">MANGO_FEST // VENTAS_STAFF</h2>
              <span className="event-date">OBJETIVO DIARIO: {statsVendedor.objetivo} TICKETS</span>
            </div>
            <div className="hero-action">
              <button className="btn-stats-direct">MI_PROGRESO</button>
            </div>
          </div>

          <div className="hero-stats-grid">
            <div className="stat-item">
              <div className="stat-info">
                <span>TICKETS_VENDIDOS</span>
                <span>{statsVendedor.vendidosHoy} / {statsVendedor.objetivo}</span>
              </div>
              <LinearProgress 
                variant="determinate" 
                value={(statsVendedor.vendidosHoy / statsVendedor.objetivo) * 100} 
                className="stat-bar"
              />
            </div>
            <div className="stat-item">
              <div className="stat-info">
                <span>EFECTIVIDAD_LOGRADA</span>
                <span>{Math.round((statsVendedor.vendidosHoy / statsVendedor.objetivo) * 100)}%</span>
              </div>
              <LinearProgress 
                variant="determinate" 
                value={(statsVendedor.vendidosHoy / statsVendedor.objetivo) * 100} 
                className="stat-bar scan-bar"
              />
            </div>
          </div>
        </div>

        {/* GRID DE ACCIONES (Igual que el Admin) */}
        <div className="row g-4 mt-2 mb-5">
          {actions.map((action, index) => (
            <div 
              key={index} 
              className="col-xl-6 col-lg-6 col-md-6 col-sm-12"
              onClick={() => navigate(action.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`home-option-card ${action.category === 'live' ? 'card-live' : ''}`}>
                <div className="card-border-top"></div>
                <div className="icon-wrapper-home">
                  {action.icon}
                </div>
                <div className="card-info-home">
                  <h3>{action.title}</h3>
                  <p>{action.desc}</p>
                </div>
                <div className="card-corner-fx"></div>
                {action.category === 'live' && <div className="live-tag">LIVE</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeVendedor;