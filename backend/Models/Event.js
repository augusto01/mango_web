const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, uppercase: true, default: 'GENERAL' },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  // Nuevo: Seguimiento de tickets emitidos
  sold: { type: Number, default: 0 },
  // Nuevo: Control manual para el front-end
  isActive: { type: Boolean, default: true },
  maxStockPerSeller: { type: Number, default: 0 }
});

const LoteSchema = new mongoose.Schema({
  loteName: { 
    type: String, 
    uppercase: true, 
    required: true 
  },
  // Determina si el lote completo está habilitado
  isActive: { 
    type: Boolean, 
    default: true 
  },
  // Tiempo límite de venta en días desde la creación
  expirationDays: { 
    type: Number, 
    default: 0 
  },
  categories: [CategorySchema]
}, { 
  timestamps: true 
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  address: { type: String },
  date: { type: Date, required: true },
  djs: [{ type: String }],
  flyer: { type: String }, 
  ageLimit: { type: String, default: '18' },
  lotes: [LoteSchema],
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' }
}, { timestamps: true });

// Middleware pre-save: Si el stock llega al límite, desactivar categoría automáticamente
EventSchema.pre('save', function(next) {
  this.lotes.forEach(lote => {
    lote.categories.forEach(cat => {
      // Si el vendido iguala o supera al stock, forzamos isActive a false
      if (cat.stock > 0 && cat.sold >= cat.stock) {
        cat.isActive = false;
      }
    });
  });
  next();
});

module.exports = mongoose.model('Event', EventSchema);