const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  cel: Number,
  rol: { type: String, enum: ["administrador", "usuario"], default: "usuario" },
  empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa" },
  created_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },

});

// Evitar OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
