import React from 'react';
import '../../styles/Footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import SvgIcon from '@mui/material/SvgIcon';

import logoMango from '../../../public/img/mangocompleto.png';
import { Typography } from '@mui/material';

// Ícono de TikTok (SVG oficial)
const TikTokIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 448 512">
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </SvgIcon>
);

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
          <a href="#" className="social-link-item"><TikTokIcon /></a>        </div>
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