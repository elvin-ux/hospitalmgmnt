require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("./db");
const Patient = require("./models/patientModel"); 
const auth = require("./middleware/auth");
const Admin = require('./models/adminModel');
const Appointment = require('./models/appointmentModel');
const verifyRole = require('./middleware/verifyRole');
const Doctor = require('./models/doctorModel');
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || "defaultSecretKey";

const adminEmail = "admin@gmail.com";
const adminPassword = "admin123";

app.use(express.json());
app.use(cors());

// ------------------ Connect MongoDB ------------------
connectDB();

// ------------------ Routes ------------------

// Patient Registration
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

// Patient Login
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
      { id: patient._id, email: patient.email, role: "patient" },
      SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});


// --- Get Profile of Logged-in Patient 

app.get("/api/patient/profile", auth, verifyRole("patient"), async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.json({
      name: patient.name,
      email: patient.email,
      age: patient.age || "N/A",
      
      gender: patient.gender || "N/A", 
      bloodGroup: patient.bloodGroup || "N/A",
      phone: patient.phone || "N/A",
      address: patient.address || "N/A",
      allergies: patient.allergies || [],
      medicalConditions: patient.medicalConditions || [],
      medications: patient.medications || [],
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});


// --- Update Patient Medical Info 
app.put("/api/patient/update-medical", auth, verifyRole("patient"), async (req, res) => {
  const { allergies, medicalConditions, medications } = req.body;

  try {
    
    if (!Array.isArray(allergies) || !Array.isArray(medicalConditions) || !Array.isArray(medications)) {
        return res.status(400).json({ error: "Medical fields must be arrays." });
    }

    const updated = await Patient.findByIdAndUpdate(
      req.user.id,
      { allergies, medicalConditions, medications },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Patient not found" });

    res.json({ message: "Medical info updated successfully", patient: updated });
  } catch (err) {
    console.error("Medical update error:", err);
    res.status(500).json({ error: "Failed to update medical info" });
  }
});







// SECURED ROUTE: Doctor to View Patient Info by Email
// GET /api/doctor/patient-lookup
app.get("/api/doctor/patient-lookup", auth, verifyRole("doctor"), async (req, res) => {
  const { email } = req.query; // Patient email is passed as a query parameter
  
  if (!email) {
    return res.status(400).json({ error: "Email parameter is required." });
  }
  
  try {
    const patient = await Patient.findOne({ email });
    
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Return comprehensive medical and personal data needed by the doctor
    res.json({
      name: patient.name,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone, // Adding phone and email for contact
      email: patient.email,
      allergies: patient.allergies || [],
      medicalConditions: patient.medicalConditions || [],
      medications: patient.medications || [],
    });
  } catch (err) {
    console.error("Patient lookup error:", err);
    res.status(500).json({ error: "Failed to fetch patient data" });
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
  console.log('Booking Payload:', req.body);
  const { doctorId, date, time, reason } = req.body;
  if (!doctorId || !date || !time || !reason) {
    return res.status(400).json({ error: 'Missing one or more required fields.' });
  }
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
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});



// --- Get Appointments for Logged-in Patient ---
app.get('/api/patient/appointments', auth, verifyRole('patient'), async (req, res) => {
  try {
 
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialty experience') // Populate doctor details
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    console.error('Failed to fetch patient appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// PUT /api/patient/cancel-appointment/:id
app.put('/api/patient/cancel-appointment/:id', auth, verifyRole('patient'), async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedAppt = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'Cancelled' }, // Set status to Cancelled
      { new: true }
    );

    if (!updatedAppt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment: updatedAppt });
  } catch (err) {
    console.error('Cancellation error:', err);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// PUT /api/patient/reschedule-appointment/:id
app.put('/api/patient/reschedule-appointment/:id', auth, verifyRole('patient'), async (req, res) => {
  const { date, time } = req.body;
  
  if (!date || !time) {
    return res.status(400).json({ error: 'New date and time are required for rescheduling.' });
  }

  try {
    const appointmentId = req.params.id;
    const updatedAppt = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date: new Date(date), time: time, status: 'Scheduled' }, // Update date/time and set status back to Scheduled
      { new: true }
    );

    if (!updatedAppt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment rescheduled successfully', appointment: updatedAppt });
  } catch (err) {
    console.error('Reschedule error:', err);
    res.status(500).json({ error: 'Failed to reschedule appointment' });
  }
});


// Admin add doctor
app.post("/api/admin/add-doctor", async (req, res) => {
  const { name, email, password, specialty, phone, experience } = req.body;

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor)
      return res.status(400).json({ error: "Doctor already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({ name, email, password: hashedPassword, specialty, phone, experience });
    await newDoctor.save();
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add doctor" });
  }
});


// server.js (Verification - This route is correct)

// Doctor login
app.post('/api/doctor/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: "doctor" }, // ✅ Correct role payload
      SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Doctor profile
app.get('/api/doctor/profile', auth, verifyRole('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.json({
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      phone: doctor.phone,
      experience:doctor.experience,
      
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Doctor Update Profile
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

// GET /api/doctor/appointments
app.get('/api/doctor/appointments', auth, verifyRole('doctor'), async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            // Populate necessary patient details for display
            .populate('patient', 'name email phone age bloodGroup allergies medicalConditions') 
            .sort({ date: 1, time: 1 }); 

        res.json(appointments);
    } catch (err) {
        console.error('Doctor appointments fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});
// server.js

// Doctor Dashboard Metrics (NEW ROUTE)
app.get('/api/doctor/metrics', auth, verifyRole('doctor'), async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Count patients seen by this doctor (requires a query against the Appointment model)
        const patientsCount = await Appointment.distinct('patient', { doctor: doctorId });
        const totalPatients = patientsCount.length;

        // Count total appointments for this doctor
        const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });

        res.json({
            totalPatients: totalPatients,
            totalAppointments: totalAppointments,
            // Example: Pending appointments count (optional, but useful)
            pendingAppointments: await Appointment.countDocuments({ doctor: doctorId, status: 'Scheduled' }), 
        });
    } catch (err) {
        console.error('Doctor metrics fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch doctor metrics' });
    }
});


// Route to return doctors for patient dashboard (simplified)
app.get('/api/patient/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, '-password -profilePic -bio');
    // No destructuring, use doc._id
    const result = doctors.map(doc => ({
      _id: doc._id, // CRITICAL for booking
      name: doc.name,
      specialty: doc.specialty,
      experience: doc.experience || 'N/A',
      availability: doc.availability || [],
      rating: 4.5,
    }));
    res.status(200).json(result);
  } catch (err) {
    console.error('Doctors fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch doctors list' });
  }
});

// server.js

// Doctor Get Unique Patients List
// GET /api/doctor/patients
app.get('/api/doctor/patients', auth, verifyRole('doctor'), async (req, res) => {
    try {
        const doctorId = req.user.id;

        // 1. Find all unique patient IDs associated with this doctor
        const patientIds = await Appointment.distinct('patient', { doctor: doctorId });

        // 2. Fetch the details for those unique patients, excluding sensitive data
        const patients = await Patient.find({ _id: { $in: patientIds } }, '-password -allergies -medicalConditions -medications');

        res.json(patients);
    } catch (err) {
        console.error('Doctor patient list fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch patient list' });
    }
});

// ---- Admin Login ----
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Admin login successful", token });
  } else {
    res.status(401).json({ error: "Invalid admin credentials" });
  }
});

// Admin list doctors (FIXED: Added auth and verifyRole('admin') middleware)
app.get("/api/admin/doctors", auth, verifyRole("admin"), async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// DELETE /api/admin/delete-patient/:id
app.delete('/api/admin/delete-patient/:id', auth, verifyRole('admin'), async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient)
      return res.status(404).json({ error: 'Patient not found' });

    // Optional: Also delete any appointments associated with this patient
    await Appointment.deleteMany({ patient: req.params.id });

    res.json({ message: 'Patient and associated appointments deleted successfully' });
  } catch (err) {
    console.error('Delete patient error:', err);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});



app.delete('/api/admin/delete-doctor/:id', auth, verifyRole('admin'), async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor)
      return res.status(404).json({ error: 'Doctor not found' });
    
    // Optional: Also delete any appointments associated with this doctor
    await Appointment.deleteMany({ doctor: req.params.id });

    res.json({ message: 'Doctor and associated appointments deleted successfully' });
  } catch (err) {
    console.error('Delete doctor error:', err);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});



// DELETE /api/admin/delete-appointment/:id
app.delete('/api/admin/delete-appointment/:id', auth, verifyRole('admin'), async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment)
      return res.status(404).json({ error: 'Appointment not found' });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Delete appointment error:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
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


// Admin list patients
app.get("/api/admin/patients", auth, verifyRole("admin"), async (req, res) => {
  try {
    // Find all patients and exclude the password field
    const patients = await Patient.find({}, "-password"); 
    
    // Respond with the list of patients
    res.json(patients);
  } catch (err) {
    console.error("Admin patient fetch error:", err);
    // Respond with a 500 status code and an error message on failure
    res.status(500).json({ error: "Failed to fetch patients list" });
  }
});
// ------------------ Start Server ------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
