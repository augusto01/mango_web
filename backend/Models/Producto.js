// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: String,
  description: String,
  por_descuento: Number,
  por_marginal: Number,
  category: String,
  quantity: Number,
  medida: String,
  provider: String,
  price_siva: Number,
  price_usd: Number,
  price_final: Number,
  create_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
