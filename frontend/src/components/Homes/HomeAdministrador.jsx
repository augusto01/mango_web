import React from 'react';
import { 
  FaBoxes, FaUsers, FaChartLine, FaMusic, FaQrcode, FaTicketAlt, FaBolt 
} from 'react-icons/fa';
import { IoCalendarNumber } from "react-icons/io5";
import { MdAnalytics } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authProvider';
import Navbar from '../../components/Layout/Navbar';
import { Typography, LinearProgress } from '@mui/material';
import '../../styles/HomeRoles.css';

const HomeAdministrador = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || user?.username || 'Admin_User';

  // Datos mockeados del evento más próximo (Esto vendría de una API)
  const proximoEvento = {
    nombre: "MANGO_FEST // WINTER_EDITION",
    fecha: "15_JUL_2026",
    vendidas: 850,
    totalTickets: 1000,
    escaneadas: 320
  };

  const options = [
    { icon: <FaQrcode className="icon-scan" />, title: 'SCANNER_QR', path: '/escaner', desc: 'Validación de Accesos', category: 'live' },
    { icon: <FaTicketAlt />, title: 'Entradas', path: '/ventas', desc: 'Módulo de Boletería', category: 'live' },
    { icon: <IoCalendarNumber />, title: 'Eventos', path: '/eventos-admin', desc: 'Configurar Fechas' },
    { icon: <FaUsers />, title: 'Staff_MNG', path: '/usuarios', desc: 'Gestión de Personal' },
    { icon: <MdAnalytics />, title: 'Reportes', path: '/reportes', desc: 'Estadísticas de Venta' },
    { icon: <FaChartLine />, title: 'Finanzas', path: '/finanzas', desc: 'Balances de Evento' },
  ];

  return (
    <div className="home-dashboard-wrapper">
      <Navbar /> 
      <div className="home-glow-bg"></div>

      <div className="container home-content-z" style={{ paddingTop: '100px' }}>
        
        {/* HEADER BIENVENIDA */}
        <div className="home-welcome-header">
          <div className="welcome-text-box">
            <Typography variant="h6" className="system-status">
              <span className="blink">●</span> ADMINISTRADOR_ROOT
            </Typography>
            <h1 className="welcome-title">HOLA, {userName.toUpperCase()}</h1>
          </div>
          <button className="quick-scan-btn" onClick={() => navigate('/escaner')}>
              <FaQrcode /> <span>FAST_SCAN</span>
          </button>
        </div>

        {/* SECCIÓN EVENTO PRÓXIMO & STATS RÁPIDAS */}
        <div className="next-event-hero" onClick={() => navigate('/reportes')}>
          <div className="hero-header">
            <div className="event-info">
              <span className="label-tech"><FaBolt /> NEXT_EVENT</span>
              <h2 className="event-name">{proximoEvento.nombre}</h2>
              <span className="event-date">{proximoEvento.fecha}</span>
            </div>
            <div className="hero-action">
              <button className="btn-stats-direct">VER_DETALLES</button>
            </div>
          </div>

          <div className="hero-stats-grid">
            <div className="stat-item">
              <div className="stat-info">
                <span>TICKETS_SOLD</span>
                <span>{proximoEvento.vendidas} / {proximoEvento.totalTickets}</span>
              </div>
              <LinearProgress 
                variant="determinate" 
                value={(proximoEvento.vendidas / proximoEvento.totalTickets) * 100} 
                className="stat-bar"
              />
            </div>
            <div className="stat-item">
              <div className="stat-info">
                <span>CHECK_IN_QR</span>
                <span>{proximoEvento.escaneadas} / {proximoEvento.vendidas}</span>
              </div>
              <LinearProgress 
                variant="determinate" 
                value={(proximoEvento.escaneadas / proximoEvento.vendidas) * 100} 
                className="stat-bar scan-bar"
              />
            </div>
          </div>
        </div>

        {/* GRID DE OPCIONES */}
        <div className="row g-4 mt-2 mb-5">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="col-xl-4 col-lg-4 col-md-6 col-sm-12"
              onClick={() => navigate(option.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`home-option-card ${option.category === 'live' ? 'card-live' : ''}`}>
                <div className="card-border-top"></div>
                <div className="icon-wrapper-home">{option.icon}</div>
                <div className="card-info-home">
                  <h3>{option.title}</h3>
                  <p>{option.desc}</p>
                </div>
                <div className="card-corner-fx"></div>
                {option.category === 'live' && <div className="live-tag">LIVE</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeAdministrador;