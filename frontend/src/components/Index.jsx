import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Layout/Navbar'; 
import Footer from './Layout/Footer';
import Hero from './Index/Hero';
import Events from './Index/Events';
import DjSection from './Index/DjSection';
import Gallery from './Index/Gallery';
import CautionTape from './Index/CautionTape';

const Index = () => {
  return (
    <Box className="main-wrapper">
      <Navbar />
      <Box className="index-container">
        <Hero />
        
        <CautionTape text="PRÓXIMOS EVENTOS ⚡ MANGO EXPERIENCE 🔥" />
        <Events />
        
        <CautionTape text="DJ'S ⚡ ARTISTAS QUE HAN PASADO POR MANGO 🔥" reverse />
        <DjSection />

        <CautionTape text="MOMENTOS INOLVIDABLES • MANGO RECUERDOS •" />
        <Gallery />
      </Box>
      <Footer />
    </Box>
  );
};

export default Index;