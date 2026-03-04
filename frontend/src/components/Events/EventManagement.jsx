import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrashAlt, FaArrowLeft, FaSearch, 
  FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt 
} from 'react-icons/fa';

// CORRECCIÓN: Importación completa de componentes de MUI
import { 
  Typography, 
  IconButton, 
  TextField, 
  CircularProgress, 
  Box, 
  Fade, 
  InputAdornment 
} from '@mui/material';

// Componentes y Hooks
import Navbar from '../../components/Layout/Navbar';
import EventFormModal from './EventFormModal';
import { useEvents } from '../../hooks/Events/useEvents';

// Estilos
import '../../styles/HomeRoles.css'; 
import '../../styles/EventManagement.css'; 

const EventManagement = () => {
  const navigate = useNavigate();
  const { events, getEvents, deleteEvent, loading } = useEvents();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Carga inicial de datos
  useEffect(() => {
    getEvents();
  }, [getEvents]);

  // Filtrado reactivo por nombre o locación
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter(ev => 
      ev.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, events]);

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="home-dashboard-wrapper event-container">
      <Navbar />
      <div className="home-glow-bg"></div>

      <div className="container home-content-z" style={{ paddingTop: '100px' }}>
        
        {/* NAVEGACIÓN SUPERIOR */}
        <div className="staff-navigation-top">
           <button className="btn-back-minimal" onClick={() => navigate(-1)}>
              <FaArrowLeft /> VOLVER_AL_PANEL
           </button>
        </div>

        {/* HEADER DE BIENVENIDA */}
        <div className="home-welcome-header">
          <div className="welcome-text-box">
            <Typography variant="h6" className="system-status">
              <span className="blink">●</span> LIVE_DATABASE // EVENTS_CONTROL
            </Typography>
            <h1 className="welcome-title">GESTIÓN DE EVENTOS</h1>
          </div>
          <button className="quick-scan-btn" onClick={handleOpenCreate}>
              <FaPlus /> <span>CREAR_EVENTO</span>
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="staff-filter-bar">
          <div className="search-box-industrial">
            <TextField
              placeholder="BUSCAR EVENTO POR NOMBRE O LUGAR..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch style={{ color: '#FF6B00' }} />
                  </InputAdornment>
                ),
              }}
              className="industrial-input"
            />
          </div>
        </div>

        {/* GRILLA DE EVENTOS */}
        <div className="event-grid mb-5">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', p: 8 }}>
              <CircularProgress sx={{ color: '#FF6B00' }} />
            </Box>
          ) : (
            <Fade in={!loading}>
              <div className="event-cards-container">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <div key={event._id || event.id} className="event-card-industrial">
                      <div className="event-card-flyer">
                        <img 
                          src={event.flyer || 'https://via.placeholder.com/300x400'} 
                          alt={event.name} 
                          onError={(e) => e.target.src = 'https://via.placeholder.com/300x400'}
                        />
                        <div className="event-status-tag">{event.status || 'ACTIVE'}</div>
                      </div>
                      
                      <div className="event-card-body">
                        <h3 className="event-card-title">{event.name?.toUpperCase()}</h3>
                        
                        <div className="event-card-info">
                          <p><FaCalendarAlt /> {event.date ? new Date(event.date).toLocaleDateString() : 'FECHA_PENDIENTE'}</p>
                          <p><FaMapMarkerAlt /> {event.location || 'UBICACIÓN_NO_DEFINIDA'}</p>
                          <p><FaTicketAlt /> STOCK: {event.totalStock || 0}</p>
                        </div>

                        <div className="event-card-tiers">
                          {/* Muestra las categorías principales como badges */}
                          {event.categories?.map((cat, idx) => (
                            <span key={idx} className={`mini-tier-badge ${cat.name?.toLowerCase()}`}>
                              {cat.name}: {cat.useLotes ? 'POR_LOTES' : `$${cat.price}`}
                            </span>
                          ))}
                        </div>

                        <div className="event-card-actions">
                          <button className="btn-event-edit" onClick={() => handleEdit(event)}>
                            <FaEdit /> EDITAR
                          </button>
                          <button className="btn-event-delete" onClick={() => deleteEvent(event._id || event.id)}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data-msg">NO_EVENTS_FOUND // BASE DE DATOS VACÍA</div>
                )}
              </div>
            </Fade>
          )}
        </div>
      </div>

      <EventFormModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        eventToEdit={selectedEvent}
        onSave={() => getEvents()} 
      />
    </div>
  );
};

export default EventManagement;