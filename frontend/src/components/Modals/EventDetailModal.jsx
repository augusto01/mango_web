import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, IconButton, Divider, Backdrop, Fade } from '@mui/material';
import { FiX, FiCalendar, FiMapPin, FiClock, FiMusic, FiZap, FiAlertCircle } from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi';
import '../../styles/EventModal.css';

const EventDetailModal = ({ open, onClose, evento }) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });

  // Gestión del cronómetro de urgencia
  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        const newSeconds = prev.seconds === 0 ? 59 : prev.seconds - 1;
        const newMinutes = prev.seconds === 0 ? prev.minutes - 1 : prev.minutes;
        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

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
          sx: { backdropFilter: 'blur(15px)', backgroundColor: 'rgba(0,0,0,0.85)' } 
        }
      }}
    >
      <Fade in={open}>
        <Box className="modal-industrial-clean"> 
          {/* MARCA DE AGUA DEL LOGO */}
          <div className="modal-watermark"></div>

          <IconButton className="modal-close-btn" onClick={onClose} sx={{ zIndex: 10 }}>
            <FiX />
          </IconButton>

          <Box className="modal-minimal-content">
            <header className="modal-tech-header">
              <div className="batch-badge">LOTE 1 - EARLY_BIRD</div>
              <Typography className="event-title-huge">{evento.title}</Typography>
              
              <Box className="info-row-minimal">
                <span><FiCalendar /> {evento.date}</span>
                <span><FiMapPin /> {evento.location}</span>
                <span><FiClock /> {evento.limitHour}</span>
              </Box>
            </header>

            {/* SECCIÓN DE URGENCIA */}
            <Box className="urgency-container">
              <div className="countdown-wrapper">
                <Typography className="tech-label-xs">LOTE 1 EXPIRA EN:</Typography>
                <Typography className="countdown-timer">
                  {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </Typography>
              </div>
            </Box>

            <Divider className="divider-minimal" />

            {/* LINEUP */}
            <div className="section-container">
              <Typography className="sub-label-tech"><FiMusic /> LINEUP_DATA</Typography>
              <div className="lineup-flex">
                {evento.lineup?.map((dj, i) => (
                  <span key={i} className="artist-tag-minimal"><FiZap /> {dj}</span>
                ))}
              </div>
            </div>

            <Divider className="divider-minimal" />

            {/* TICKETS */}
            <div className="section-container">
              <Typography className="sub-label-tech"><HiOutlineTicket /> ACCESS_SELECTION</Typography>
              <div className="tickets-stack">
                <div className="ticket-item-minimal general">
                  <div className="t-info">
                    <span className="t-label">ADMISIÓN GENERAL</span>
                    <span className="t-price">${evento.precios?.general}</span>
                  </div>
                  <Button className="btn-mango-minimal">COMPRAR</Button>
                </div>

                <div className="ticket-item-minimal vip">
                  <div className="t-info">
                    <span className="t-label">EXPERIENCIA VIP</span>
                    <span className="t-price">${evento.precios?.vip}</span>
                  </div>
                  <Button className="btn-mango-minimal vip-btn">COMPRAR</Button>
                </div>
              </div>
            </div>

            <footer className="modal-footer-minimal">
              <FiAlertCircle /> // PRECIOS SUJETOS A CAMBIO SEGÚN DISPONIBILIDAD DE LOTE.
            </footer>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventDetailModal;