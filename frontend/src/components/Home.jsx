import React from 'react';
import { 
  FaBoxes, FaUsers, FaChartLine, FaUserTie, 
  FaShoppingCart, FaWarehouse, FaHistory, FaMusic 
} from 'react-icons/fa';
import { RiMoneyDollarCircleFill, RiDashboardFill } from "react-icons/ri";
import { IoCalendarNumber } from "react-icons/io5";
import { BiSolidUserBadge } from "react-icons/bi";
import { MdOutlineWork } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authProvider';
import Navbar from '../components/Layout/Navbar'; // Importado correctamente
import { Typography } from '@mui/material';
import '../styles/Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Ajusté a user?.name porque en tu middleware usas 'name'
  const userName = user?.name || user?.username || 'User_Unknown';

  const options = [
    { icon: <RiMoneyDollarCircleFill />, title: 'Ventas', path: '/ventas', desc: 'Tickets y Barra' },
    { icon: <FaBoxes />, title: 'Inventario', path: '/productos', desc: 'Stock Bebidas' },
    { icon: <FaUsers />, title: 'Usuarios', path: '/usuarios', desc: 'Staff de Staff' },
    { icon: <FaUserTie />, title: 'Clientes', path: '/clientes', desc: 'Base VIP' },
    { icon: <FaChartLine />, title: 'Reportes', path: '/reportes', desc: 'Métricas Fest' },
    { icon: <BiSolidUserBadge />, title: 'Proveedores', path: '/proveedores', desc: 'Logística' },
    { icon: <FaShoppingCart />, title: 'Compras', path: '/compras', desc: 'Insumos' },
    { icon: <FaWarehouse />, title: 'Almacén', path: '/almacen', desc: 'Depósito Central' },
    { icon: <FaHistory />, title: 'Servicios', path: '/servicios', desc: 'Mantenimiento' },
    { icon: <MdOutlineWork />, title: 'Trabajos', path: '/trabajos', desc: 'Tareas Staff' },
    { icon: <IoCalendarNumber />, title: 'Calendario', path: '/calendario', desc: 'Próximas Fechas' },
    { icon: <FaMusic />, title: 'Line Up', path: '/lineup', desc: 'Gestión de DJs' }
  ];

  return (
    <div className="home-dashboard-wrapper">
      
      {/* 1. AGREGAMOS EL NAVBAR AQUÍ ABAJO */}
      <Navbar /> 

      {/* Fondo con luces sutiles */}
      <div className="home-glow-bg"></div>

      {/* 2. IMPORTANTE: El margen superior (mt-5 o superior) para que el Nav no tape el título */}
      <div className="container home-content-z" style={{ paddingTop: '100px' }}>
        
        {/* Header de Bienvenida */}
        <div className="home-welcome-header">
          <div className="welcome-text-box">
            <Typography variant="h6" className="system-status">
              <span className="blink">●</span> SYSTEM_ONLINE v.2026
            </Typography>
            <h1 className="welcome-title">HOLA, {userName.toUpperCase()}</h1>
          </div>
        </div>

        {/* Grid de Opciones */}
        <div className="row g-4 mt-2">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
              onClick={() => navigate(option.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className="home-option-card">
                <div className="card-border-top"></div>
                <div className="icon-wrapper-home">
                  {option.icon}
                </div>
                <div className="card-info-home">
                  <h3>{option.title}</h3>
                  <p>{option.desc}</p>
                </div>
                <div className="card-corner-fx"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;