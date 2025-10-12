require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("./db");
const Patient = require("./models/patientModel"); // adjust path if needed
const auth = require("./middleware/auth");
const Admin = require('./models/adminModel');
const Appointment = require('./models/appointmentModel');
const verifyRole = require('./middleware/verifyRole');
const Doctor = require('./models/doctorModel');
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

//patient login
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
      { id: patient._id, email: patient.email, role: "patient" }, // Added role
      SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
  console.error("Login error:", err); // this will help!
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

 // Patient Appointment Booking

app.post('/api/patient/book-appointment', auth, verifyRole('patient'), async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  try {
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
      reason,
      status: 'Scheduled' 
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    console.error("Book appointment error:", err); // Improved logging
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

app.get('/api/patient/appointments', auth, verifyRole('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialty experience')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});



// ✅ Doctor Routes

//Adding doctors
app.post('/api/admin/add-doctor', auth, verifyRole('admin'), async (req, res) => {
  const { name, email, password, specialty, phone } = req.body;

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Doctor already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialty,
      phone,
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add doctor' });
  }
});

//doctor login

app.post('/api/doctor/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: "doctor" },
      SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

//doctor profile
app.get('/api/doctor/profile', auth, verifyRole('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.json({
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      phone: doctor.phone,
      experience:doctor.experience,
      
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});


// Doctor Update Profile Route
app.put('/api/doctor/update-profile', auth, verifyRole('doctor'), async (req, res) => {
  const { name, specialty, phone, experience } = req.body;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { name, specialty, phone, experience },
      { new: true }
    );
    if (!updatedDoctor)
      return res.status(404).json({ error: 'Doctor not found' });

    res.json({ message: 'Profile updated', doctor: updatedDoctor });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


// Doctor Appointment Management
app.get('/api/doctor/appointments', auth, verifyRole('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});


// Route to return doctors for patient dashboard
app.get('/api/patient/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, '-password');
    const result = doctors.map(doctor => ({
      name: doctor.name,
      specialty: doctor.specialty,
      experience: doctor.experience || 'N/A',
      available: "Mon-Fri 9:00-17:00", // hardcoded as requested
      rating: 4.5, // hardcoded
    }));
    res.status(200).json(result);
  } catch (err) {
    console.error('Doctors fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch doctors list' });
  }
});



// ✅ Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Admin login successful", token });
  } else {
    res.status(401).json({ error: "Invalid admin credentials" });
  }
});


//Admin List Doctors Route
app.get('/api/admin/doctors', auth, verifyRole('admin'), async (req, res) => {
  try {
    const doctors = await Doctor.find({}, '-password'); // exclude password
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

//Admin Delete Doctor
app.delete('/api/admin/delete-doctor/:id', auth, verifyRole('admin'), async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor)
      return res.status(404).json({ error: 'Doctor not found' });

    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});

app.get('/api/admin/appointments', auth, verifyRole('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name specialty')
      .populate('patient', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// ------------------ Start Server ------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
