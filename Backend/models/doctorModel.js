const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: String,
  phone: String,
  experience: Number,
});

module.exports = mongoose.model("Doctor", doctorSchema);
