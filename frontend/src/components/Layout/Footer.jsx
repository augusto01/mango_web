import React from 'react';
import '../../styles/Footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import logoMango from '../../assets/img/mangocompleto.png';
import { Typography } from '@mui/material';

const Footer = () => (
  <footer className="mango-footer-industrial">
    <div className="footer-container">
      
      {/* IZQUIERDA: Info de Ubicación / Sistema */}
      <div className="footer-section side-info">
        <Typography className="tech-text">LOCATION: SALADAS, CORRIENTES</Typography>
        <Typography className="tech-text">OWNER: BRUNO PORTILLO</Typography>
      </div>

      {/* CENTRO: Logo Protagonista */}
      <div className="footer-section central-branding">
        <img src={logoMango} alt="Mango Logo" className="footer-logo-main" />
      </div>

      {/* DERECHA: Redes Sociales */}
      <div className="footer-section social-links">
        <Typography className="social-header">CONNECTA CON NOSOTROS</Typography>
        <div className="icons-row">
          <a href="#" className="social-link-item"><InstagramIcon /></a>
          <a href="#" className="social-link-item"><WhatsAppIcon /></a>
          <a href="#" className="social-link-item"><FacebookIcon /></a>
        </div>
      </div>

    </div>

    {/* ABAJO: Firma del Desarrollador */}
    <div className="footer-dev-credit">
      <div className="dev-line"></div>
      <Typography className="dev-text">
        DESIGNED & DEVELOPED BY <span className="dev-name">ALMIRON AUGUSTO</span>
      </Typography>
    </div>
  </footer>
);

export default Footer;