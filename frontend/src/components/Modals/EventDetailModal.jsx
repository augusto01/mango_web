import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, IconButton, Divider, Backdrop, Fade, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { FiX, FiCalendar, FiMapPin, FiClock, FiMusic, FiZap, FiChevronDown, FiLock, FiAlertCircle } from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi';
import '../../styles/EventModal.css';

const EventDetailModal = ({ open, onClose, evento }) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (open && evento?.lotes) {
      const firstActive = evento.lotes.find(l => l.isActive);
      setExpanded(firstActive?._id || evento.lotes[0]?._id);
    }
  }, [open, evento]);

  const handleAccordionChange = (panelId) => (event, isExpanded) => {
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
        backdrop: { timeout: 500, sx: { backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.9)' } }
      }}
    >
      <Fade in={open}>
        <Box className="modal-industrial-dark"> {/* Cambiada clase para fondo oscuro */}
          <IconButton className="modal-close-btn" onClick={onClose} sx={{ zIndex: 10, color: '#fff' }}>
            <FiX />
          </IconButton>

          <Box className="modal-minimal-content">
            <header className="modal-tech-header">
              {/* TÍTULO EN NARANJA */}
              <Typography className="event-title-huge-mango">{evento.name}</Typography>
              
              <Box className="info-row-minimal">
                <span><FiCalendar color="#FF6B00" /> {new Date(evento.date).toLocaleDateString()}</span>
                <span><FiMapPin color="#FF6B00" /> {evento.location}</span>
                <span><FiClock color="#FF6B00" /> {new Date(evento.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} HS</span>
              </Box>
            </header>

            <Divider className="divider-dark" />

            <div className="section-container">
              <Typography className="sub-label-tech"><HiOutlineTicket /> BATCH_SELECTION_v2</Typography>
              
              <div className="lotes-accordion-container">
                {evento.lotes?.map((lote) => (
                  <Accordion 
                    key={lote._id} 
                    expanded={expanded === lote._id} 
                    onChange={handleAccordionChange(lote._id)}
                    className={`industrial-accordion-dark ${!lote.isActive ? 'lote-disabled' : ''}`}
                    disabled={!lote.isActive && expanded !== lote._id}
                  >
                    <AccordionSummary expandIcon={<FiChevronDown color={lote.isActive ? "#FF6B00" : "#222"} />}>
                      <Box className="accordion-summary-content">
                        <Typography className="lote-name-tech">
                           {lote.loteName}
                           {!lote.isActive && <span className="sold-out-tag">SOLD OUT</span>}
                        </Typography>
                        
                        {lote.isActive && (
                          <div className="lote-timer-inline">
                            <FiClock size={12} />
                            <span>{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                          </div>
                        )}
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ bgcolor: 'rgba(0,0,0,0.4)' }}>
                      <div className="tickets-stack">
                        {lote.categories?.map((cat) => (
                          <div key={cat._id} className="ticket-item-minimal-dark">
                            <div className="t-info">
                              <span className="t-label">{cat.name}</span>
                              <span className="t-price">${cat.price.toLocaleString()}</span>
                            </div>
                            <Button className={`btn-mango-minimal ${cat.name.includes('VIP') ? 'vip-btn' : ''}`}>
                              COMPRAR
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </div>

            <footer className="modal-footer-minimal-dark">
              <FiAlertCircle color="#444" /> SELECCIONE UN LOTE PARA DESPLEGAR CATEGORÍAS DISPONIBLES.
            </footer>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventDetailModal;