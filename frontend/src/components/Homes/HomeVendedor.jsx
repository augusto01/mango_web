import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { FiMaximize, FiPlusCircle, FiCheckSquare, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import Navbar from '../../components/Layout/Navbar';
import '../../styles/HomeDashboard.css'; 

const HomeVendedor = () => {
  const actions = [
    { title: "ESCANEAR QR", desc: "Validación rápida de acceso", icon: <FiMaximize />, type: "scan" },
    { title: "VENDER ENTRADAS", desc: "Emisión de nuevos tickets", icon: <FiPlusCircle />, type: "sell" },
    { title: "VALIDAR MANUAL", desc: "Búsqueda por DNI o código", icon: <FiCheckSquare />, type: "manual" },
    { title: "MIS TICKETS VENDIDOS", desc: "Reporte de ventas hoy", icon: <FiTrendingUp />, type: "stats" },
  ];

  return (
    <Box className="home-dashboard-wrapper">
      <Navbar />
      <div className="home-glow-bg"></div>
      
      <Container maxWidth="lg" className="home-content-z">
        <header className="home-welcome-header">
          <Box>
            <Typography className="system-status">
              <span className="blink">●</span> OPERATIVE_MODE // TERMINAL_01
            </Typography>
            <Typography className="welcome-title">
              STAFF <span className="highlight">OPERATIONS</span>
            </Typography>
            <span className="user-role-indicator vendedor">VENDEDOR AUTORIZADO</span>
          </Box>
        </header>

        <Grid container spacing={3}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={index === 0 ? 12 : 6} md={index === 0 ? 8 : 4} key={index}>
              <Box className={`home-option-card vendedor-card ${action.type}`}>
                <div className="card-border-top"></div>
                <div className="icon-wrapper-home">
                  {action.icon}
                </div>
                <div className="card-info-home">
                  <h3>{action.title}</h3>
                  <p>{action.desc}</p>
                </div>
                <div className="card-corner-fx"></div>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeVendedor;