import React from 'react';
import {
  FaBoxes, FaUsers, FaChartLine, FaUserTie,
  FaShoppingCart, FaWarehouse, FaHistory
} from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { IoCalendarNumber } from "react-icons/io5";
import { BiSolidUserBadge } from "react-icons/bi";
import { MdOutlineWork } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authProvider';
import '../styles/Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const empresaNombre = user?.empresa?.nombre || 'Nombre de la empresa';

  const options = [
    { icon: <RiMoneyDollarCircleFill size={40} />, title: 'Ventas', path: '/ventas' },
    { icon: <FaBoxes size={40} />, title: 'Inventario', path: '/productos' },
    { icon: <FaUsers size={40} />, title: 'Usuarios', path: '/usuarios' },
    { icon: <FaUserTie size={40} />, title: 'Clientes', path: '/clientes' },
    { icon: <FaChartLine size={40} />, title: 'Reportes', path: '/reportes' },
    { icon: <BiSolidUserBadge size={40} />, title: 'Proveedores', path: '/proveedores' },
    { icon: <FaShoppingCart size={40} />, title: 'Compras', path: '/compras' },
    { icon: <FaWarehouse size={40} />, title: 'Almacén', path: '/almacen' },
    { icon: <FaHistory size={40} />, title: 'Historial', path: '/historial' },
    { icon: <FaHistory size={40} />, title: 'Servicios', path: '/servicios' },
    { icon: <MdOutlineWork size={40} />, title: 'Trabajos', path: '/trabajos' },
    { icon: <IoCalendarNumber size={40} />, title: 'Calendario', path: '/calendario' }
  ];

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-5">{empresaNombre}</h1>
        <div className="row">
          {options.map((option, index) => (
            <div
              key={index}
              className="col-md-4 col-sm-6 mb-4"
              onClick={() => navigate(option.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card text-center option-card h-100">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <div className="mb-3">{option.icon}</div>
                  <h5 className="card-title">{option.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
