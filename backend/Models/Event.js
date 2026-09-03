const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, uppercase: true, default: 'GENERAL' },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  maxTicketsPerPurchase: { type: Number, default: 5 }
});

const LoteSchema = new mongoose.Schema({
  loteName: { 
    type: String, 
    uppercase: true, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
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

// Middleware pre-save
EventSchema.pre('save', function(next) {
  this.lotes.forEach(lote => {
    lote.categories.forEach(cat => {
      if (cat.stock > 0 && cat.sold >= cat.stock) {
        cat.isActive = false;
      }
    });
  });
  next();
});

// Evita re-compilar el modelo en Nodemon / hot-reloads
module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);