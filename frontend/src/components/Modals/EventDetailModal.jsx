import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, Button, IconButton, Divider, Backdrop, Fade, Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import { 
  FiX, FiCalendar, FiMapPin, FiClock, FiChevronDown, FiLock, FiAlertCircle, FiTag, FiShoppingBag 
} from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi';
import '../../styles/EventModal.css';

const EventDetailModal = ({ open, onClose, evento }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open || !evento?.date) return;

    const calculateTime = () => {
      const target = new Date(evento.date).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [open, evento]);

  useEffect(() => {
    if (open && evento?.lotes) {
      const firstActive = evento.lotes.find(l => l.isActive);
      setExpanded(firstActive?._id || false);
    }
  }, [open, evento]);

  if (!evento) return null;

  // Formateador de fecha con nombre de día
  const formatFullDate = (dateStr) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('es-ES', options).toUpperCase();
  };

  return (
    <Modal
      open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(15px)', backgroundColor: 'rgba(0,0,0,0.85)' } } }}
    >
      <Fade in={open}>
        <Box className="modal-industrial-dark">
          <IconButton className="modal-close-btn" onClick={onClose} sx={{ zIndex: 10, color: '#fff' }}><FiX size={24} /></IconButton>
          
          <Box className="modal-minimal-content">
            <header className="modal-tech-header">
              <Typography className="event-title-huge-mango">{evento.name}</Typography>
              <Box className="info-row-minimal">
                {/* DÍA DE LA SEMANA INCLUIDO AQUÍ */}
                <span><FiCalendar color="#FF6B00" /> {formatFullDate(evento.date)}</span>
                <span><FiMapPin color="#FF6B00" /> {evento.location}</span>
                <span><FiClock color="#FF6B00" /> {new Date(evento.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} HS</span>
              </Box>
            </header>

            <Divider className="divider-dark" />

            <div className="section-container">
              <Typography className="sub-label-tech"><HiOutlineTicket /> ACCESS_INVENTORY_v10.0</Typography>
              
              <div className="lotes-accordion-container">
                {evento.lotes?.map((lote) => {
                  const isLoteActive = lote.isActive;
                  return (
                    <Accordion 
                      key={lote._id} 
                      expanded={expanded === lote._id && isLoteActive} 
                      onChange={(e, isExp) => isLoteActive && setExpanded(isExp ? lote._id : false)}
                      className={`industrial-accordion-dark ${!isLoteActive ? 'lote-locked' : ''}`}
                      disabled={!isLoteActive}
                    >
                      <AccordionSummary expandIcon={isLoteActive ? <FiChevronDown color="#FF6B00" /> : <FiLock color="#666" />}>
                        <Box className="accordion-summary-content">
                          <Typography className="lote-name-tech">
                            {lote.loteName} 
                            {!isLoteActive && <span className="sold-out-tag">LOTE_OFFLINE</span>}
                          </Typography>
                          
                          {isLoteActive && (
                            <div className="lote-timer-inline">
                              <FiClock size={12} color="#FF6B00" />
                              <span style={{ color: '#FF6B00', fontFamily: 'JetBrains Mono' }}>
                                {String(timeLeft.days).padStart(2, '0')}D : {String(timeLeft.hours).padStart(2, '0')}H : {String(timeLeft.minutes).padStart(2, '0')}M
                              </span>
                            </div>
                          )}
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ bgcolor: 'rgba(10,10,10,0.8)', borderTop: '1px solid #1a1a1a' }}>
                        <div className="tickets-stack">
                          {lote.categories?.map((cat) => {
                            const isOutOfStock = Number(cat.stock) === 0 || Number(cat.sold) >= Number(cat.stock);
                            const isAvailable = cat.isActive && !isOutOfStock;

                            return (
                              <div key={cat._id} className={`ticket-item-minimal-dark ${!isAvailable ? 'cat-disabled' : ''}`}>
                                <div className="t-info">
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span className="t-label">{cat.name}</span>
                                    {!isAvailable && <span className="cat-sold-out-mini">SOLD_OUT</span>}
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FiTag size={12} color="#666" />
                                    <span className="t-price">${cat.price.toLocaleString()}</span>
                                  </Box>
                                </div>
                                
                                <Button 
                                  className="btn-mango-minimal" 
                                  disabled={!isAvailable} 
                                  startIcon={isAvailable ? <FiShoppingBag size={14}/> : null}
                                >
                                  {isAvailable ? 'SELECT' : 'SOLD_OUT'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            </div>

            <footer className="modal-footer-minimal-dark">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiAlertCircle color="#FF6B00" className="blink" /> 
                <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', color: '#999' }}>
                  CORE_SYNC: ACTIVE. INVENTORY_PROTECTION: v10.0_STABLE.
                </Typography>
              </Box>
            </footer>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventDetailModal;