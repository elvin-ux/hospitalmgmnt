require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("./db");
const Patient = require("./models/patientModel"); // adjust path if needed
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || "defaultSecretKey";

app.use(express.json());
app.use(cors());

// ------------------ Connect MongoDB ------------------
connectDB();

// ------------------ Routes ------------------

// ✅ Patient Registration
app.post("/api/patient/register", async (req, res) => {
  const { name, email, password, age, address, phone, bloodGroup } = req.body;
  try {
    const existing = await Patient.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({
      name,
      email,
      password: hashedPassword,
      age,
      address,
      phone,
      bloodGroup,
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ Patient Login
app.post("/api/patient/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: patient._id, email: patient.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Public Profile for Doctor to View Patient Info
app.get("/api/patient/profile/for-doctor", async (req, res) => {
  const { email } = req.query;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.json({
      name: patient.name,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies || [],
      medicalConditions: patient.medicalConditions || [],
      medications: patient.medications || [],
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update patient medical info
app.put("/api/patient/update-medical", auth, async (req, res) => {
  const { allergies, medicalConditions, medications } = req.body;

  try {
    const updated = await Patient.findByIdAndUpdate(
      req.user.id,
      { allergies, medicalConditions, medications },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Patient not found" });

    res.json({ message: "Medical info updated successfully", patient: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update medical info" });
  }
});


// ✅ Doctor Routes (example placeholder)
app.get("/api/doctor", (req, res) => {
  res.send("Doctor routes coming soon...");
});

// ✅ Admin Routes (example placeholder)
app.get("/api/admin", (req, res) => {
  res.send("Admin routes coming soon...");
});

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🏥 Hospital Management System Backend Running Successfully");
});

// ------------------ Start Server ------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
