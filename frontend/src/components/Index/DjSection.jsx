import React from 'react';
import { Box, Typography } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../../styles/Index.css';
const djs = [
  { 
    name: 'NICKO RUIZ', 
    genre: 'TECH HOUSE', 
    img: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?auto=format&fit=crop&q=80&w=1000', 
    tag: 'HEADLINER' 
  },
  { 
    name: 'MICA TORRES', 
    genre: 'PROGRESSIVE', 
    img: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&q=80&w=1000', 
    tag: 'SPECIAL GUEST' 
  },
  { 
    name: 'ALEX V-SYSTEM', 
    genre: 'HARD TECHNO', 
    img: 'https://images.unsplash.com/photo-1574391884720-bbe37400581a?auto=format&fit=crop&q=80&w=1000', 
    tag: 'CLOSING SET' 
  },
  { 
    name: 'LUNA STARK', 
    genre: 'MINIMAL', 
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1000', 
    tag: 'OPENING ACT' 
  }
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 }, // Muestra 3 por pantalla
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 1.5 }, // Muestra 1 y medio para invitar a scrollear
};

const DjSection = () => (
  <Box className="dj-carousel-container" id="djs">
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3000}
      keyBoardControl={true}
      customTransition="transform 800ms ease-in-out"
      transitionDuration={800}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile", "desktop"]} // Oculta flechas para un look más limpio
      pauseOnHover={true}
    >
      {djs.map((dj, i) => (
        <Box key={i} className="dj-card-compact carousel-item-spacing">
          <div className="dj-grain-overlay"></div>
          <img src={dj.img} alt={dj.name} className="dj-img" />
          
          <Box className="dj-tag-status-compact">
            <span className="blink-dot-orange"></span>
            {dj.tag}
          </Box>

          <Box className="dj-info-compact">
            <Typography className="dj-genre-compact">{dj.genre}</Typography>
            <Typography className="dj-name-compact">{dj.name}</Typography>
          </Box>
          
          <div className="corner-tl-mini"></div>
          <div className="corner-br-mini"></div>
        </Box>
      ))}
    </Carousel>
  </Box>
);

export default DjSection;