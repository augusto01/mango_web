import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';


// 🏠 Iconos
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// 🎨 Estilos y Assets
import 'react-multi-carousel/lib/styles.css';
import '../styles/Index.css';
import Navbar from './Layout/Navbar'; 
import Footer from './Layout/Footer';
import logoMango from '../assets/img/mangocompleto.png';

const Index = () => {
  const navigate = useNavigate();
  
  // 📝 Lógica de Frases en Loop
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = ["¿TE LO VAS A PERDER?", "VIVÍ LA EXPERIENCIA", "MÁS QUE UNA FIESTA"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const proximosEventos = [
    { 
      title: 'Neon Night', 
      date: 'Sábado 20/05', 
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
      age: '+18',
      location: 'Main Stage - Saladas',
      limitHour: '02:30 AM',
      price: '$5.000',
    },
    { 
      title: 'After Hour Solo Set', 
      date: 'Viernes 26/05', 
      img: 'https://images.unsplash.com/photo-1514525253344-af6363ef7136?auto=format&fit=crop&q=80&w=1000',
      age: '+21',
      location: 'Terraza Mango',
      limitHour: '03:00 AM',
      price: '$7.500',
    },
    { 
      title: 'Winter Fest', 
      date: 'Sábado 03/06', 
      img: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=1000',
      age: '+18',
      location: 'Estadio Mango',
      limitHour: '02:00 AM',
      price: '$4.500',
    },
    { 
      title: 'Electronic Jungle', 
      date: 'Viernes 16/06', 
      img: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=1000',
      age: '+18',
      location: 'Patio Tropical',
      limitHour: '02:45 AM',
      price: '$6.000',
    },
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
    mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
  };

  return (
    <Box className="main-wrapper">
      <Navbar />

      <Box className="index-container">
        
        {/* 🏎️ Hero Section */}
        {/* ... dentro de tu Hero Section en Index.jsx ... */}
        <Box className="hero-section">
          <img src={logoMango} alt="Logo Mango" className="hero-logo animate-fade-in" />
          
         <Box className="phrase-container">
          {/* La key asegura que la animación de 'textTransition' se reinicie suavemente */}
          <Typography key={currentPhrase} variant="h4" className="hero-subtitle-laser">
            {phrases[currentPhrase]}
          </Typography>
        </Box>

        
        </Box>

        {/* ⚠️ Banda de Precaución 1: EVENTOS */}
        <Box className="caution-tape">
          <Box className="caution-track">
            {[...Array(10)].map((_, i) => (
              <Typography key={i} variant="h6" className="caution-text">
                PRÓXIMOS EVENTOS ⚡ MANGO EXPERIENCE 🔥 PRÓXIMOS EVENTOS ⚡ MANGO COMPLETO 🔥
              </Typography>
            ))}
          </Box>
        </Box>

        {/* 🔥 Sección Eventos */}
        <Box className="section-container" id="eventos">
          <Carousel 
            responsive={responsive} 
            infinite 
            autoPlay 
            autoPlaySpeed={4500} 
            showDots={true}
            removeArrowOnDeviceType={["mobile"]}
          >
            {proximosEventos.map((evento, idx) => (
              <Card key={idx} className="event-card">
                <CardMedia 
                  component="img" 
                  image={evento.img} 
                  className="event-media"
                />
                <CardContent className="event-content">
                  <Box className="event-header">
                    <Box className="tag-exclusive">EXCLUSIVE</Box>
                    <Typography className="event-age">{evento.age}</Typography>
                  </Box>

                  <Typography variant="h5" className="event-name">{evento.title}</Typography>
                  <Typography variant="body2" className="event-date">{evento.date}</Typography>
                  
                  <Box className="event-info-grid">
                    <Box className="info-item">
                      <PlaceIcon sx={{ fontSize: 16, color: '#FF6B00', mr: 1 }} />
                      <Typography variant="caption">{evento.location}</Typography>
                    </Box>
                    <Box className="info-item">
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#FF6B00', mr: 1 }} />
                      <Typography variant="caption">Ingreso máx: {evento.limitHour}</Typography>
                    </Box>
                  </Box>

                  <Button className="btn-event-buy" fullWidth>
                    quiero mi anti — {evento.price} →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Box>

        {/* ⚠️ Banda de Precaución 2: RECUERDOS */}
        <Box className="caution-tape caution-reverse">
          <Box className="caution-track">
            {[...Array(15)].map((_, i) => (
              <Typography key={i} variant="h6" className="caution-text">
                MOMENTOS INOLVIDABLES • MANGO RECUERDOS •
              </Typography>
            ))}
          </Box>
        </Box>

        {/* 📸 Sección Galería */}
        <Box className="section-container gallery-bg" id="fotos">
          <Grid container spacing={4} justifyContent="center" className="gallery-grid">
            {['Opening 2026', 'Summer Night', 'Techno Stage'].map((album, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <Box 
                  className="gallery-card outlined-photo-card" 
                  onClick={() => window.open('https://drive.google.com/...', '_blank')}
                >
                  <Box className="scan-line" />
                  <Box className="icon-container-photo">
                    <PhotoLibraryOutlinedIcon 
                      sx={{ 
                        fontSize: 50, 
                        color: 'transparent', 
                        stroke: '#FF6B00', 
                        strokeWidth: 1.2,
                        filter: 'drop-shadow(0 0 5px rgba(255, 107, 0, 0.3))',
                      }} 
                      className="photo-icon-neon"
                    />
                  </Box>
                  <Typography variant="h6" className="album-title">{album}</Typography>
                  <Typography variant="caption" className="album-link">
                    VER RECUERDOS ↗
                  </Typography>
                  <Box className="corner-accent" />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Index;