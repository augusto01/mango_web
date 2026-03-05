import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, CircularProgress, Box, useMediaQuery, useTheme } from '@mui/material';
import { FiPlus, FiActivity, FiDatabase } from 'react-icons/fi';
import { useEvents } from '../../hooks/Events/useEvents';
import EventFormModal from './EventFormModal';
import Navbar from '../Layout/Navbar'; 
import '../../styles/EventManagement.css';

const EventManagement = () => {
  const { events, getEvents, loading, error } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <Box className="staff-container">
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* CABECERA AL ESTILO HOME-WELCOME-HEADER DE STAFF */}
        <header className="home-welcome-header" style={{ 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: isMobile ? '20px' : '0'
        }}>
          <Box>
            <Typography className="sub-label-tech">
              <FiActivity className="blink" style={{ color: '#FF6B00' }} /> 
              SYSTEM_DATABASE // UNIT_EVENTS_v7.2
            </Typography>
            <Typography variant="h2" className="event-title-huge">
              MIS EVENTOS
            </Typography>
          </Box>
          
          {/* BOTÓN CON CORTE DIAGONAL (QUICK-SCAN-BTN) */}
          <button 
            className="quick-scan-btn" 
            onClick={handleOpenCreate}
            style={{ width: isMobile ? '100%' : 'auto' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <FiPlus /> AGREGAR NUEVO EVENTO
            </Box>
          </button>
        </header>

        {/* MANEJO DE ERRORES CON ESTILO INDUSTRIAL */}
        {error && (
          <Box sx={{ p: 2, mb: 4, border: '1px solid #ff3131', background: 'rgba(255,49,49,0.05)' }}>
            <Typography className="staff-audit-cell" sx={{ color: '#ff3131' }}>
              {`> [TERMINAL_ERROR]: ${error}`}
            </Typography>
          </Box>
        )}

        {/* ESTADO DE CARGA */}
        {loading && events.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={30} sx={{ color: '#FF6B00', mb: 2 }} />
            <Typography className="sub-label-tech">SYNCHRONIZING_DATABASE...</Typography>
          </Box>
        ) : (
          <div className="event-cards-container">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="event-card-industrial" 
                onClick={() => handleOpenEdit(event)}
              >
                {/* Contenedor de Imagen con el filtro de Staff */}
                <div 
                  className="event-card-flyer-box"
                  style={{ 
                    height: '240px', 
                    backgroundImage: `url(${event.flyer || 'https://via.placeholder.com/400x600/000/333?text=NO_ASSET'})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                  }} 
                />
                
                {/* Metadata con tipografía JetBrains Mono de Staff */}
                <Box sx={{ p: 3, borderTop: '1px solid #111' }}>
                  <Typography className="sub-label-tech" sx={{ mb: '4px !important' }}>
                    <span className="dot-active"></span>
                    {event.date ? new Date(event.date).toLocaleDateString('es-AR') : 'NO_DATE'}
                  </Typography>
                  
                  <Typography variant="h5" className="card-title-staff" sx={{ color: '#fff', mb: 1 }}>
                    {event.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography className="staff-id-tag">
                      LOC: {event.location}
                    </Typography>
                    <span className="role-badge administrador" style={{ fontSize: '8px' }}>
                      ACTIVE_UNIT
                    </span>
                  </Box>
                </Box>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* MODAL QUE USA LA CLASE modal-industrial-clean */}
      <EventFormModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={getEvents} 
        eventToEdit={selectedEvent} 
      />
    </Box>
  );
};

export default EventManagement;