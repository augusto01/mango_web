import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, CardMedia, CardContent, Container, CircularProgress, IconButton } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

// Hooks y Componentes
import { useEvents } from '../../hooks/Events/useEvents';
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
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    getEvents();
  }, []);

  const eventosActivos = useMemo(() => {
    return events.filter(ev => ev.status === 'active');
  }, [events]);

  const toggleFlip = (eventId) => {
    setFlippedCards(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleOpenModal = (evento) => {
    setSelectedEvent(evento);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return `${dias[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  };

  // Cálculo global del evento para determinar si hay stock en general
  const getEventTicketSummary = (evento) => {
    const lotes = evento.lotes || [];
    if (lotes.length === 0) return { isSoldOut: true, priceText: 'SOLD OUT' };

    let prices = [];
    let hasAvailableStock = false;

    lotes.forEach(lote => {
      if (!lote.isActive) return;
      const categories = lote.categories || [];
      categories.forEach(cat => {
        if (cat.price !== undefined) prices.push(Number(cat.price));
        if (cat.isActive && (cat.stock === undefined || Number(cat.stock) > 0)) {
          hasAvailableStock = true;
        }
      });
    });

    if (prices.length === 0 || !hasAvailableStock) return { isSoldOut: true, priceText: 'SOLD OUT' };

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceText = minPrice === maxPrice ? `$${minPrice.toLocaleString()}` : `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;

    return { isSoldOut: false, priceText };
  };

  return (
    <Box component="section" sx={{ position: 'relative', bgcolor: '#000', zIndex: 1, overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="eventos">
        
        <Typography 
          variant="h2" 
          sx={{ 
            fontFamily: 'Syncopate', 
            fontWeight: 800, 
            color: '#fff', 
            mb: 8, 
            letterSpacing: -2,
            fontSize: { xs: '2rem', md: '3.5rem' },
            textAlign: 'center',
            width: '100%'
          }}
        >
          PRÓXIMOS <span style={{ color: '#FF6B00' }}>EVENTOS</span>
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#FF6B00' }} />
          </Box>
        ) : eventosActivos.length > 0 ? (
          <Box sx={{ width: '100%' }}>
            <Carousel 
              responsive={responsive} 
              infinite={eventosActivos.length > 3}
              autoPlay={false}
              itemClass="carousel-item-padding"
              removeArrowOnDeviceType={["mobile"]}
            >
              {eventosActivos.map((evento) => {
                const { isSoldOut, priceText } = getEventTicketSummary(evento);
                const isFlipped = Boolean(flippedCards[evento._id]);
                const allLotes = evento.lotes || [];

                return (
                  <div key={evento._id} className={`flip-card-container ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="flip-card-inner">
                      
                      {/* === FRENTE DE LA TARJETA === */}
                      <div className="flip-card-front">
                        <div className="age-badge">+{evento.ageLimit || '18'}</div>
                        
                        <CardMedia
                          component="img"
                          image={evento.flyer || '/img/event1.png'}
                          alt={evento.name}
                          className="img-industrial"
                        />
                        
                        <CardContent className="industrial-content">
                          <Box>
                            <Typography className="industrial-title-white">
                              {evento.name}
                            </Typography>
                            
                            <div className="event-detail-row">
                              <CalendarTodayIcon /> 
                              <span>{formatDate(evento.date)}</span>
                            </div>
                            <div className="event-detail-row">
                              <PlaceIcon /> 
                              <span>{evento.location}</span>
                            </div>
                            <div className="event-detail-row">
                              <AccessTimeIcon /> 
                              <span>Ingreso: {new Date(evento.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                            </div>

                            <div className="event-detail-row" style={{ marginTop: '8px' }}>
                              <LocalActivityIcon style={{ color: isSoldOut ? '#ff1744' : '#00ff41' }} /> 
                              <span style={{ fontWeight: 'bold', color: isSoldOut ? '#ff1744' : '#00ff41' }}>
                                {isSoldOut ? 'TICKETS AGOTADOS' : `DESDE ${priceText}`}
                              </span>
                            </div>
                          </Box>

                          <Box sx={{ mt: 2.5 }}>
                            <Button 
                              className="btn-industrial-buy" 
                              fullWidth
                              onClick={() => toggleFlip(evento._id)}
                            >
                              MÁS INFO / LOTES
                            </Button>
                          </Box>
                        </CardContent>
                      </div>

                      {/* === PARTE TRASERA (DESGLOSE DE TODOS LOS LOTES CON SOLD OUT) === */}
                      <div className="flip-card-back">
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, borderBottom: '1px solid #222', pb: 1 }}>
                            <Typography sx={{ fontFamily: 'Syncopate', fontWeight: 800, color: '#FF6B00', fontSize: '0.9rem' }}>
                              ● DETALLE DE LOTES
                            </Typography>
                            <IconButton onClick={() => toggleFlip(evento._id)} sx={{ color: '#888', p: 0.5 }}>
                              <RotateLeftIcon size={18} />
                            </IconButton>
                          </Box>

                          {/* CONTENEDOR CON DESPLAZAMIENTO */}
                          <div className="lotes-scroll-container">
                            {allLotes.length === 0 ? (
                              <Typography sx={{ color: '#666', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', py: 4, textAlign: 'center' }}>
                                NO HAY LOTES REGISTRADOS
                              </Typography>
                            ) : (
                              allLotes.map((lote, lIdx) => {
                                return (
                                  <div 
                                    key={lote._id || lIdx} 
                                    className="lote-card-item"
                                    style={{
                                      opacity: lote.isActive ? 1 : 0.6,
                                      borderLeftColor: lote.isActive ? '#FF6B00' : '#444'
                                    }}
                                  >
                                    <div className="lote-title" style={{ color: lote.isActive ? '#FF6B00' : '#777' }}>
                                      {lote.loteName || `LOTE ${lIdx + 1}`} {!lote.isActive && '(INACTIVO)'}
                                    </div>
                                    
                                    {lote.categories?.map((cat, cIdx) => {
                                      const isCategorySoldOut = !lote.isActive || !cat.isActive || (cat.stock !== undefined && Number(cat.stock) <= 0);

                                      return (
                                        <div key={cat._id || cIdx} className="category-row">
                                          <span>{cat.name}</span>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ 
                                              color: isCategorySoldOut ? '#888' : '#00ff41', 
                                              fontWeight: 'bold',
                                              textDecoration: isCategorySoldOut ? 'line-through' : 'none'
                                            }}>
                                              ${Number(cat.price).toLocaleString()}
                                            </span>
                                            {isCategorySoldOut && (
                                              <span style={{ 
                                                color: '#ff1744', 
                                                fontWeight: '900', 
                                                fontSize: '0.65rem',
                                                background: 'rgba(255, 23, 68, 0.1)',
                                                padding: '1px 5px',
                                                borderRadius: '3px',
                                                border: '1px solid rgba(255, 23, 68, 0.3)'
                                              }}>
                                                SOLD OUT
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </Box>

                        <Box sx={{ pt: 2, display: 'flex', gap: 1 }}>
                          <Button 
                            className="btn-industrial-back" 
                            onClick={() => toggleFlip(evento._id)}
                            sx={{ width: '35%' }}
                          >
                            VOLVER
                          </Button>

                         
                        </Box>

                      </div>

                    </div>
                  </div>
                );
              })}
            </Carousel>
          </Box>
        ) : (
          <Typography sx={{ color: '#444', fontFamily: 'JetBrains Mono', textAlign: 'center', py: 6 }}>
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