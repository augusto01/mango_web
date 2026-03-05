import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Container, CircularProgress } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Hooks y Componentes
import { useEvents } from '../../hooks/Events/useEvents'; // Asegúrate de que el path sea correcto
import '../../styles/Events.css';
import EventDetailModal from '../Modals/EventDetailModal';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
};

const Events = () => {
  const { events, getEvents, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 1. Cargar eventos al montar el componente
  useEffect(() => {
    getEvents();
  }, []);

  // 2. Filtrar solo los eventos con status 'active'
  const eventosActivos = events.filter(ev => ev.status === 'active');

  const handleOpenModal = (evento) => {
    setSelectedEvent(evento);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  // Formateador de fecha para el diseño
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return `${dias[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <Box component="section" sx={{ position: 'relative', bgcolor: '#000', zIndex: 1, overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ py: 12 }} id="eventos">
        
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#FF6B00' }} />
          </Box>
        ) : eventosActivos.length > 0 ? (
          <Carousel 
            responsive={responsive} 
            infinite={eventosActivos.length > 3}
            autoPlay={true}
            autoPlaySpeed={5000}
            itemClass="carousel-item-padding"
            removeArrowOnDeviceType={["mobile"]}
          >
            {eventosActivos.map((evento) => (
              <Card key={evento._id} className="event-card-industrial">
                {/* Badge de Edad dinámico */}
                <div className="age-badge">+{evento.ageLimit || '18'}</div>
                
                <CardMedia
                  component="img"
                  image={evento.flyer || 'https://via.placeholder.com/500x700?text=MANGO+EVENT'}
                  alt={evento.name}
                  className="img-industrial"
                  sx={{ height: 450, objectFit: 'cover' }}
                />
                
                <CardContent className="industrial-content">
                  <Box>
                    <Typography className="industrial-title-white">
                      {evento.name}
                    </Typography>
                    
                    <div className="event-detail-row">
                      <CalendarTodayIcon sx={{ fontSize: 18, color: '#FF6B00' }} /> 
                      <span>{formatDate(evento.date)}</span>
                    </div>
                    <div className="event-detail-row">
                      <PlaceIcon sx={{ fontSize: 18, color: '#FF6B00' }} /> 
                      <span>{evento.location}</span>
                    </div>
                    <div className="event-detail-row">
                      <AccessTimeIcon sx={{ fontSize: 18, color: '#FF6B00' }} /> 
                      {/* Aquí podrías usar un campo limitHour si lo agregas al schema, 
                          o usar la hora de la fecha del evento */}
                      <span>Ingreso: {new Date(evento.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
        ) : (
          <Typography sx={{ color: '#444', fontFamily: 'JetBrains Mono', textAlign: 'center' }}>
            {">"} NO_ACTIVE_EVENTS_FOUND_IN_DATABASE
          </Typography>
        )}
      </Container>

      <EventDetailModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        evento={selectedEvent} 
      />
    </Box>
  );
};

export default Events;