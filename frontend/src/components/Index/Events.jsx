import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Container } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Estilos y Componentes
import '../../styles/Events.css';
import EventDetailModal from '../Modals/EventDetailModal';

// Datos de los eventos (Asegúrate de que esta constante exista)
const proximosEventos = [
  { 
    title: 'Neon Night', 
    date: 'Sábado 20/05', 
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
    age: '18',
    location: 'Main Stage - Saladas',
    limitHour: '02:30 AM',
    lineup: ['DJ Dark Pulse', 'Techno Queen', 'Visual FX Artist'],
    precios: { general: 5000, vip: 12000 }
  },
  { 
    title: 'After Hour Solo Set', 
    date: 'Viernes 26/05', 
    img: 'https://images.unsplash.com/photo-1514525253344-af6363ef7136?auto=format&fit=crop&q=80&w=1000',
    age: '21',
    location: 'Terraza Mango',
    limitHour: '03:00 AM',
    lineup: ['The Mastermind', 'Minimal Ghost', 'Support Act'],
    precios: { general: 4500, vip: 10000 }
  },
  { 
    title: 'Industrial Techno', 
    date: 'Sábado 03/06', 
    img: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&q=80&w=1000',
    age: '18',
    location: 'Underground Vault',
    limitHour: '02:00 AM',
    lineup: ['Raw Bass', 'Warehouse Project', 'Heavy Synth'],
    precios: { general: 6000, vip: 15000 }
  },
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
};

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Manejador para abrir el modal con los datos del evento
  const handleOpenModal = (evento) => {
    console.log("Inyectando evento al modal:", evento.title);
    setSelectedEvent(evento);
    setModalOpen(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    // Timeout opcional para que la limpieza de datos no rompa la animación de salida
    setTimeout(() => setSelectedEvent(null), 300);
  };

  return (
    <Box component="section" sx={{ position: 'relative', bgcolor: '#000', zIndex: 1, overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ py: 12 }} id="eventos">
        
        {/* Título Industrial Mango */}
        <Typography 
          variant="h2" 
          sx={{ 
            fontFamily: 'Syncopate', 
            fontWeight: 800, 
            color: '#fff', 
            mb: 8, 
            letterSpacing: -2,
            fontSize: { xs: '2rem', md: '3.5rem' },
            textAlign: 'left'
          }}
        >
          PRÓXIMOS <span style={{ color: '#FF6B00' }}>EVENTOS</span>
        </Typography>

        {/* Carrusel */}
        <Carousel 
          responsive={responsive} 
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          itemClass="carousel-item-padding"
          removeArrowOnDeviceType={["mobile"]}
        >
          {proximosEventos.map((evento, idx) => (
            <Card key={idx} className="event-card-industrial">
              <div className="age-badge">+{evento.age}</div>
              
              <CardMedia
                component="img"
                image={evento.img}
                alt={evento.title}
                className="img-industrial"
              />
              
              <CardContent className="industrial-content">
                <Box>
                  <Typography className="industrial-title-white">
                    {evento.title}
                  </Typography>
                  
                  <div className="event-detail-row">
                    <CalendarTodayIcon /> <span>{evento.date}</span>
                  </div>
                  <div className="event-detail-row">
                    <PlaceIcon /> <span>{evento.location}</span>
                  </div>
                  <div className="event-detail-row">
                    <AccessTimeIcon /> <span>Ingreso hasta: {evento.limitHour}</span>
                  </div>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Button 
                    className="btn-industrial-buy" 
                    fullWidth
                    onClick={() => handleOpenModal(evento)}
                  >
                    COMPRAR TICKETS
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </Container>

      {/* RENDERIZADO DEL MODAL */}
      <EventDetailModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        evento={selectedEvent} 
      />
    </Box>
  );
};

export default Events;