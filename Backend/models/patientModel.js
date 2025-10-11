const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  address: String,
  phone: String,
  bloodGroup: String,

  // Medical info — to be added later by patient
  allergies: { type: [String], default: [] },
  medicalConditions: { type: [String], default: [] },
  medications: { type: [String], default: [] },
});

module.exports = mongoose.model("Patient", patientSchema);
