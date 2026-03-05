import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { FiPlus, FiActivity, FiEdit3, FiInfo, FiTrash2 } from 'react-icons/fi';
import { useEvents } from '../../hooks/Events/useEvents';
import EventFormModal from './EventFormModal';
import Navbar from '../Layout/Navbar'; 
import '../../styles/EventManagement.css';

const EventManagement = () => {
  const { events, getEvents, deleteEvent, loading, error } = useEvents();
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

  const handleDelete = async (id, name) => {
    if (window.confirm(`> CAUTION: PERMANENTLY DELETE ${name.toUpperCase()}?`)) {
      await deleteEvent(id);
      getEvents();
    }
  };

  return (
    <Box className="staff-container">
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
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
          
          <button className="quick-scan-btn" onClick={handleOpenCreate} style={{ width: isMobile ? '100%' : 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <FiPlus /> AGREGAR NUEVO EVENTO
            </Box>
          </button>
        </header>

        {loading && events.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={30} sx={{ color: '#FF6B00', mb: 2 }} />
            <Typography className="sub-label-tech">SYNCHRONIZING_DATABASE...</Typography>
          </Box>
        ) : (
          <div className="event-cards-container">
            {events.map((event) => (
              <div key={event._id} className="event-card-industrial">
                {/* Visualización del Flyer */}
                <div className="event-card-flyer-box" style={{ 
                    height: '220px', 
                    backgroundImage: `url(${event.flyer || 'https://via.placeholder.com/400x600/000/333?text=NO_ASSET'})`, 
                    backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                
                {/* BARRA DE ACCIONES TÉCNICAS (DEBAJO DE LA FOTO) */}
                <Box className="card-action-bar-integrated">
                  <button onClick={() => handleOpenEdit(event)} className="action-btn-sub edit">
                    <FiEdit3 /> <span>EDIT</span>
                  </button>
                  <button onClick={() => console.log("Info", event._id)} className="action-btn-sub info">
                    <FiInfo /> <span>DATA</span>
                  </button>
                  <button onClick={() => handleDelete(event._id, event.name)} className="action-btn-sub delete">
                    <FiTrash2 /> <span>PURGE</span>
                  </button>
                </Box>

                <Box sx={{ p: 2.5, borderTop: '1px solid #1a1a1a' }}>
                  <Typography className="sub-label-tech" sx={{ mb: '4px !important', fontSize: '10px' }}>
                    <span className="dot-active"></span>
                    {event.date ? new Date(event.date).toLocaleDateString('es-AR') : 'NO_DATE'}
                  </Typography>
                  <Typography variant="h6" className="card-title-staff" sx={{ color: '#fff', mb: 1, fontSize: '1.1rem' }}>
                    {event.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography className="staff-id-tag" sx={{ fontSize: '9px' }}>LOC: {event.location}</Typography>
                    <span className="role-badge administrador" style={{ fontSize: '7px', padding: '2px 6px' }}>ACTIVE</span>
                  </Box>
                </Box>
              </div>
            ))}
          </div>
        )}
      </Container>

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