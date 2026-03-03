const { Schema, model } = require('mongoose');

const EmpresaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  direccion: String,
  telefono: String,
  email: String,
  estado: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Empresa', EmpresaSchema);
