import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';
import logoMango from '../../../public/img/mango.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efecto para cambiar el estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`mango-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <img src={logoMango} alt="Mango Completo" />
        </Link>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <a href="#eventos" className="nav-item" onClick={() => setIsOpen(false)}>Eventos</a>
          <a href="#fotos" className="nav-item" onClick={() => setIsOpen(false)}>Fotos</a>
          <a href="#contacto" className="nav-item" onClick={() => setIsOpen(false)}>Contacto</a>
          <Link to="/login" className="nav-login-minimal" onClick={() => setIsOpen(false)}>
            Entrar
          </Link>
        </div>

        <button className={`nav-hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;