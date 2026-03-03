import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logoMango from '../../assets/img/mangocompleto.png';
import '../../styles/Index.css';


const Hero = () => {
  const navigate = useNavigate();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = ["¿TE LO VAS A PERDER?", "VIVÍ LA EXPERIENCIA", "MÁS QUE UNA FIESTA"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="hero-section">
      <img src={logoMango} alt="Logo Mango" className="hero-logo animate-fade-in" />
      <Box className="phrase-container">
        <Typography key={currentPhrase} variant="h4" className="hero-subtitle-laser">
          {phrases[currentPhrase]}
        </Typography>
      </Box>
      <Button className="btn-hero" onClick={() => navigate('/login')}>
        MIS ENTRADAS (QR) 🎫
      </Button>
    </Box>
  );
};

export default Hero;