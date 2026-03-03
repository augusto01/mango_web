import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { FiStar, FiMapPin } from 'react-icons/fi';
import '../../styles/HomeRoles.css';
import Navbar from '../../components/Layout/Navbar'; // Importado correctamente


const HomeConsumidor = () => {
  const eventos = [
    { id: 1, nombre: 'MANGO FEST 2026', fecha: '20 MAR', imagen: '/img/event1.jpg' },
    { id: 2, nombre: 'TECHNO NIGHT', fecha: '15 ABR', imagen: '/img/event2.jpg' },
  ];

  return (
    <Box className="home-container">
            {/* 1. AGREGAMOS EL NAVBAR AQUÍ ABAJO */}
      <Navbar /> 
      <Typography className="home-title">PRÓXIMOS <span className="highlight">EVENTOS</span></Typography>
      <Grid container spacing={3}>
        {eventos.map((event) => (
          <Grid item xs={12} sm={6} key={event.id}>
            <Card className="event-card">
              <CardMedia component="img" height="200" image={event.imagen} alt={event.nombre} />
              <CardContent className="event-content">
                <Typography className="event-date">{event.fecha}</Typography>
                <Typography className="event-name">{event.nombre}</Typography>
                <Box className="event-info">
                  <FiMapPin /> <Typography>Estadio Central</Typography>
                </Box>
                <Button className="btn-buy-now">COMPRAR TICKET</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomeConsumidor;