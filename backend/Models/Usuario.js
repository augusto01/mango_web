const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  cel: Number,
  // ACTUALIZADO: Agregamos "control" al enum
  rol: { 
    type: String, 
    enum: ["administrador", "vendedor", "control"], 
    default: "vendedor",
    lowercase: true 
  },
  empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa" },
  created_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);