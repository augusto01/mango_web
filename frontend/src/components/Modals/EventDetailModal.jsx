import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, IconButton, Divider, Backdrop, Fade, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { FiX, FiCalendar, FiMapPin, FiClock, FiMusic, FiZap, FiChevronDown, FiLock, FiAlertCircle } from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi';
import '../../styles/EventModal.css';

const EventDetailModal = ({ open, onClose, evento }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expanded, setExpanded] = useState(false);

  // 1. Lógica del Contador de Tiempo Real (Días, Horas, Minutos, Segundos)
  useEffect(() => {
    if (!open || !evento?.date) return;

    const calculateTime = () => {
      const target = new Date(evento.date).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTime(); // Ejecución inicial
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [open, evento]);

  // 2. Gestión de expansión automática de Lotes
  useEffect(() => {
    if (open && evento?.lotes) {
      const firstActive = evento.lotes.find(l => l.isActive);
      setExpanded(firstActive?._id || false);
    }
  }, [open, evento]);

  const handleAccordionChange = (panelId, isActive) => (event, isExpanded) => {
    if (!isActive) return; // Bloqueo de apertura si está Sold Out
    setExpanded(isExpanded ? panelId : false);
  };

  if (!evento) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: { 
          timeout: 500, 
          sx: { backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.92)' } 
        }
      }}
    >
      <Fade in={open}>
        <Box className="modal-industrial-dark">
          <IconButton className="modal-close-btn" onClick={onClose} sx={{ zIndex: 10, color: '#fff' }}>
            <FiX />
          </IconButton>

          <Box className="modal-minimal-content">
            <header className="modal-tech-header">
              <Typography className="event-title-huge-mango">{evento.name}</Typography>
              
              <Box className="info-row-minimal">
                <span><FiCalendar color="#FF6B00" /> {new Date(evento.date).toLocaleDateString()}</span>
                <span><FiMapPin color="#FF6B00" /> {evento.location}</span>
                <span><FiClock color="#FF6B00" /> {new Date(evento.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} HS</span>
              </Box>
            </header>

            <Divider className="divider-dark" />

            <div className="section-container">
              <Typography className="sub-label-tech"><HiOutlineTicket /> ACCESS_CONTROL_SYSTEM_v2</Typography>
              
              <div className="lotes-accordion-container">
                {evento.lotes?.map((lote) => {
                  const isActive = lote.isActive;
                  return (
                    <Accordion 
                      key={lote._id} 
                      expanded={expanded === lote._id && isActive} 
                      onChange={handleAccordionChange(lote._id, isActive)}
                      className={`industrial-accordion-dark ${!isActive ? 'lote-locked' : ''}`}
                      disabled={!isActive}
                    >
                      <AccordionSummary expandIcon={isActive ? <FiChevronDown color="#FF6B00" /> : <FiLock color="#666" />}>
                        <Box className="accordion-summary-content">
                          <Typography className="lote-name-tech">
                             {lote.loteName}
                             {!isActive && <span className="sold-out-tag">PURGED / SOLD OUT</span>}
                          </Typography>
                          
                          {isActive && (
                            <div className="lote-timer-inline">
                              <FiClock size={12} />
                              <span>
                                {timeLeft.days > 0 && `${timeLeft.days}D : `}
                                {String(timeLeft.hours).padStart(2, '0')}H : 
                                {String(timeLeft.minutes).padStart(2, '0')}M
                              </span>
                            </div>
                          )}
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ bgcolor: 'rgba(0,0,0,0.6)', borderTop: '1px solid #1a1a1a' }}>
                        <div className="tickets-stack">
                          {lote.categories?.map((cat) => (
                            <div key={cat._id} className="ticket-item-minimal-dark">
                              <div className="t-info">
                                <span className="t-label">{cat.name}</span>
                                <span className="t-price">${cat.price.toLocaleString()}</span>
                              </div>
                              <Button 
                                className={`btn-mango-minimal ${cat.name.includes('VIP') ? 'vip-btn' : ''}`}
                                onClick={() => console.log(`Seleccionado: ${cat.name} - ${lote.loteName}`)}
                              >
                                SELECT_UNIT
                              </Button>
                            </div>
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            </div>

            <footer className="modal-footer-minimal-dark">
              <FiAlertCircle color="#FF6B00" /> 
              <span>SISTEMA DE RESERVAS DINÁMICO. LOS PRECIOS PUEDEN VARIAR SIN PREVIO AVISO SEGÚN DISPONIBILIDAD.</span>
            </footer>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventDetailModal;