import React, { useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // Icono para TikTok
import '../../styles/Djs.css';

const djs = [
  { 
    name: 'DJ ROSSO', 
    genre: 'CACHENGUE', 
    img: '/img/djs/rossoperfil.png', 
    tag: 'Contact',
    socials: { ig: 'https://instagram.com/djrosso', ws: 'https://wa.me/123', tk: 'https://tiktok.com/@djrosso' }
  },
  { 
    name: '17 DJ', 
    genre: 'CACHENGUE', 
    img: '/img/djs/17perfil.png', 
    tag: 'Contact',
    socials: { ig: 'https://instagram.com', ws: 'https://wa.me/123', tk: 'https://tiktok.com' }
  },
  { 
    name: 'IAN BARION DJ', 
    genre: 'CACHENGUE', 
    img: '/img/djs/barionperfil.png', 
    tag: 'CLOSING SET',
    socials: { ig: 'https://instagram.com', ws: 'https://wa.me/123', tk: 'https://tiktok.com' }
  },
 
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
};

const DjSection = () => {
  const [flipped, setFlipped] = useState({});

  const handleFlip = (i) => {
    setFlipped(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <Box sx={{ bgcolor: '#000', py: 10 }}>
      <Container maxWidth="lg" id="djs">
        <Typography variant="h2" className="dj-section-title">
          LINE UP <span style={{ color: '#FF6B00' }}>/</span> ARTISTAS
        </Typography>

        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={!Object.values(flipped).some(v => v)} // Pausa si hay alguno volteado
          itemClass="carousel-item-padding"
          removeArrowOnDeviceType={["mobile"]}
        >
          {djs.map((dj, i) => (
            <Box key={i} className={`flip-card ${flipped[i] ? 'is-flipped' : ''}`}>
              <Box className="flip-card-inner">
                
                {/* --- FRONT: IMAGEN Y NOMBRE --- */}
                <Box className="flip-card-front dj-card-square">
                  <div className="dj-grain-overlay"></div>
                  <img src={dj.img} alt={dj.name} className="dj-img" />
                  <Box className="dj-tag-status-compact">
                    <span className="blink-dot-orange"></span> {dj.tag}
                  </Box>
                  <Box className="dj-info-compact">
                    <Typography className="dj-genre-compact">{dj.genre}</Typography>
                    <Typography className="dj-name-compact">{dj.name}</Typography>
                    <Button className="btn-flip-trigger" onClick={() => handleFlip(i)}>
                      VER CONTACTO
                    </Button>
                  </Box>
                  <div className="corner-tl-mini"></div>
                  <div className="corner-br-mini"></div>
                </Box>

                {/* --- BACK: REDES SOCIALES --- */}
                <Box className="flip-card-back dj-card-square">
                  <Box className="back-content-container">
                    <Typography className="back-title-orange">{dj.name}</Typography>
                    <Box className="social-links-grid">
                      <Button startIcon={<InstagramIcon />} className="btn-social" href={dj.socials.ig} target="_blank">INSTAGRAM</Button>
                      <Button startIcon={<WhatsAppIcon />} className="btn-social" href={dj.socials.ws} target="_blank">WHATSAPP</Button>
                      <Button startIcon={<MusicNoteIcon />} className="btn-social" href={dj.socials.tk} target="_blank">TIKTOK</Button>
                    </Box>
                    <Button onClick={() => handleFlip(i)} sx={{ mt: 4, color: '#FF6B00', fontFamily: 'JetBrains Mono' }}>
                      ← VOLVER
                    </Button>
                  </Box>
                </Box>

              </Box>
            </Box>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
};

export default DjSection;