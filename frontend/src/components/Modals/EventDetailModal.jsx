import React from 'react';
import { Modal, Box, Typography, Button, IconButton, Divider, Backdrop, Fade } from '@mui/material';
import { FiX, FiCalendar, FiMapPin, FiClock, FiMusic, FiZap } from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi'; // Este sí tiene ticket
import '../../styles/EventModal.css';

const EventDetailModal = ({ open, onClose, evento }) => {
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
          <IconButton className="modal-close-btn" onClick={onClose}>
            <FiX />
          </IconButton>

          <Box className="modal-minimal-content">
            <header className="modal-tech-header">
              <Typography className="mango-logo-text">MANGO_FEST // 2026</Typography>
              <Typography className="event-title-huge">{evento.title}</Typography>
              
              <Box className="info-row-minimal">
                <span><FiCalendar /> {evento.date}</span>
                <span><FiMapPin /> {evento.location}</span>
                <span><FiClock /> {evento.limitHour}</span>
              </Box>
            </header>

            <Divider className="divider-minimal" />

            <div className="section-container">
              <Typography className="sub-label-tech"><FiMusic /> LINEUP_DATA</Typography>
              <div className="lineup-flex">
                {evento.lineup?.map((dj, i) => (
                  <span key={i} className="artist-tag-minimal"><FiZap /> {dj}</span>
                ))}
              </div>
            </div>

            <Divider className="divider-minimal" />

            <div className="section-container">
              {/* Cambiado FiTicket por HiOutlineTicket */}
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
              // EVENTO PARA MAYORES DE {evento.age} AÑOS. DNI FÍSICO OBLIGATORIO.
            </footer>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventDetailModal;