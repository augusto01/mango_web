const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, uppercase: true, default: 'GENERAL' },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  maxStockPerSeller: { type: Number, default: 0 }
});

const LoteSchema = new mongoose.Schema({
  loteName: { 
    type: String, 
    uppercase: true, 
    required: true 
  },
  // Determina si el lote está habilitado para la venta manual
  isActive: { 
    type: Boolean, 
    default: true 
  },
  // Representa el tiempo límite de venta en días desde la creación
  expirationDays: { 
    type: Number, 
    default: 0 // 0 significa sin límite de tiempo
  },
  categories: [CategorySchema]
}, { 
  timestamps: true // Esto te da 'createdAt', útil para calcular la expiración
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  address: { type: String },
  date: { type: Date, required: true },
  djs: [{ type: String }],
  flyer: { type: String }, // Aquí guardaremos la URL de la imagen o Base64
  ageLimit: { type: String, default: '18' },
  lotes: [LoteSchema],
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);