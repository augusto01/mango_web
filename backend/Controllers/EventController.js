const Event = require('../Models/Event');

// @desc    Crear nuevo evento
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    // Loguea el error real en tu terminal de Node
    console.log("Mongoose Validation Error:", error);
    
    res.status(400).json({ 
      message: 'Error en la infraestructura de datos', 
      details: error.message // Esto te dirá qué campo falló
    });
  }
};

// @desc    Obtener todos los eventos
// @route   GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar registros' });
  }
};

// @desc    Actualizar evento (OVERWRITE)
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedEvent) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar registro', error });
  }
};

// @desc    Eliminar evento
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registro purgado del sistema' });
  } catch (error) {
    res.status(500).json({ message: 'Error en la purga de datos' });
  }
};