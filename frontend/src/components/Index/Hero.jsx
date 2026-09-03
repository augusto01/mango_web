import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  const phrases = useMemo(
    () => ["¿TE LO VAS A PERDER?", "VIVÍ LA EXPERIENCIA", "MÁS QUE UNA FIESTA"],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <Box className="hero-main-container">
      {/* CAPAS DE AMBIENTE (Background) */}
      <div className="hero-noise-overlay" />
      <div className="hero-scanner-line" />
      <div className="screen-frame" />

      {/* PARTÍCULAS DE ENERGÍA */}
      <div className="energy-particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`particle p${i}`} />
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <Box className="hero-content">
        {/* LOGO COMPACTO CON EFECTOS */}
        <Box className="logo-container">
          <div className="logo-glow-core" />
          <img
            src="/img/mangocompleto.png"
            alt="Logo Mango"
            className="hero-logo-main"
          />
          <div className="logo-scan-fx" />
        </Box>

        {/* TÍTULO PRINCIPAL */}
        <Typography className="hero-sunset-title">
          SUNSET AGRO
        </Typography>

        {/* TEXTO DINÁMICO */}
        <Box className="text-wrapper">
          <Typography key={currentPhrase} className="hero-subtitle-modern">
            {phrases[currentPhrase]}
          </Typography>
        </Box>

       
      </Box>

      {/* TAGS DE ESQUINA */}
      <div className="corner-tag top-l">SYS_ACTIVE</div>
      <div className="corner-tag bottom-r">V_0.3.1</div>
    </Box>
  );
};

export default Hero;