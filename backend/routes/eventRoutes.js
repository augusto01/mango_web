const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../Controllers/EventController');

//obtiene todos los eventos
router.get('/all', getEvents);

// inserta un evento nuevo
router.post('/register', createEvent);

// @route   PUT / DELETE con ID
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);

module.exports = router;