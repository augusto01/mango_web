const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    default: 'CONSUMIDOR FINAL', 
    uppercase: true,
    trim: true 
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  eventName: { type: String },
  loteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  loteName: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId },
  categoryName: { type: String },
  ticketQuantity: { type: Number, default: 0 },
  ticketUnitPrice: { type: Number, default: 0 },
  coolerQuantity: { type: Number, default: 0 },
  coolerUnitPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentType: { type: String, default: 'PRESENCIAL' }
}, { 
  timestamps: true 
});

module.exports = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);