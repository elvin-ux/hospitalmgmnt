import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import axios from "axios";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
// ⭐ Importing lucide-react icons for cleaner UI
import { Stethoscope, Calendar, Clock, User, LogOut } from 'lucide-react';
import API_BASE_URL from '../api';

const CARD_MAX_WIDTH = 1000;

// ==========================================
// 1. Navbar & Layout Styles
// ==========================================

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    background: "#f8fafc", // Very light off-white background
    fontFamily: "Inter, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflowX: "hidden",
  },
  // ⭐ IMPROVED NAVBAR STYLE
  navbar: {
    width: "100%",
    boxSizing: "border-box",
    height: "64px",
    background: "#fff",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    padding: "0 40px",
    position: "sticky",
    top: 0,
    zIndex: 90,
  },
  logo: {
    fontSize: "1.45rem",
    fontWeight: 800,
    color: "#0f2c5b",
    letterSpacing: "-0.5px",
  },
  navButton: {
    fontWeight: 600,
    fontSize: "0.95rem",
    background: "transparent",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  // --- Main Content Styles ---
  mainWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerCard: {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    margin: "30px 0 20px 0",
    background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)", // Soft blue gradient
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.06)",
    padding: "30px 40px",
    boxSizing: "border-box",
  },
  sectionTitle: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#0f2c5b",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#475569",
    marginBottom: "16px",
  },
  pill: {
    background: "#3b82f6",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "0.9rem",
    marginBottom: "16px",
    display: 'inline-block',
  },
  searchInput: {
    border: "1.5px solid #cbd5e1",
    borderRadius: "8px",
    background: "#fff",
    color: "#222",
    padding: "10px 16px",
    fontSize: "0.95rem",
    width: "100%",
    maxWidth: "350px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  // ⭐ DOCTOR CARD STYLES
  doctorCard: (isActive) => ({
    width: "100%",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: isActive ? "0 8px 30px rgba(0,0,0,0.12)" : "0 4px 18px rgba(0,0,0,0.06)",
    padding: "30px 40px",
    border: "1px solid #e2e8f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: isActive ? "translateY(-4px)" : "translateY(0)",
    boxSizing: "border-box",
    gap: "20px",
    cursor: "default",
  }),
  doctorName: {
    fontWeight: 700,
    fontSize: "1.4rem",
    color: "#1e293b",
    marginBottom: 4,
  },
  specialty: {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#2574fb",
    marginBottom: 8,
  },
  details: {
    fontSize: "0.95rem",
    color: "#475569",
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  bookButton: {
    padding: "12px 28px",
    background: "#2574fb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: "0 4px 12px rgba(37,116,251,0.3)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background 0.2s, box-shadow 0.2s",
  },
};

// --- Modal Styles --- (Simplified and professional)
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(30, 41, 59, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 321,
  },
  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "90vw",
    boxShadow: "0 16px 38px rgba(0,0,0,0.2)",
    textAlign: "left",
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: "1.3rem",
    marginBottom: "15px",
    color: "#1e293b",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    fontWeight: 600,
    color: "#334155",
    fontSize: "0.95rem",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    padding: "10px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  },
  buttonGroup: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  modalSubmit: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: styles.bookButton.background,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  modalCancel: {
    padding: "10px 20px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    background: "#f1f5f9",
    color: "#1e293b",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};


const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalDoctor, setModalDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  const navigate = useNavigate();

  const fetchDoctors = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/patient/doctors")
      .then((res) => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch doctors. Please try checking your network.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openModal = (doctor) => {
    setModalDoctor(doctor);
    setShowModal(true);
    setDate("");
    setTime("");
    setReason("");
  };

  const closeModal = () => {
    setShowModal(false);
    setBooking(false);
    setDate("");
    setTime("");
    setReason("");
  };

  const handleModalBook = async (e) => {
    e.preventDefault();
    if (!date || !time || !reason) return;
    setBooking(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/patient/book-appointment",
        { doctorId: modalDoctor._id, date, time, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      closeModal(); // Close first to show cleaner alert
      alert(`Appointment booked successfully with Dr. ${modalDoctor.name}`);
      // Refresh doctor list if necessary, but typically not needed here.
    } catch (err) {
      console.error("Booking error:", err);
      closeModal();
      alert("Error booking appointment. Please ensure you are logged in.");
    } finally {
      setBooking(false);
    }
  };

  const handleCardEnter = (idx) => setActiveCard(idx);
  const handleCardLeave = () => setActiveCard(null);

  return (
    <div style={styles.container}>
      {/* ⭐ IMPROVED NAVBAR */}
      <nav style={styles.navbar}>
        <span style={styles.logo}>Hospital System</span>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/myappointments")}
            style={{ ...styles.navButton, color: "#2574fb" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e5f1ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Calendar size={18} /> My Appointments
          </button>

          <button
            onClick={() => navigate("/profile")}
            style={{ ...styles.navButton, color: "#475569" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e5f1ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <User size={18} /> Profile
          </button>
          
          <button
            onClick={() => { localStorage.removeItem('token'); navigate("/"); }}
            style={{ ...styles.navButton, color: "#e13535" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe5e5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main container */}
      <div style={styles.mainWrapper}>
        {/* Header Card */}
        <div style={styles.headerCard}>
          <div style={styles.sectionTitle}>Book Appointment</div>
          <div style={styles.subtitle}>Choose from our experienced medical professionals</div>
          
          <div style={styles.pill}>
             {filteredDoctors.length} Available Doctors
          </div>
          
          <input
            style={styles.searchInput}
            placeholder="Search by name or specialization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Doctor Cards */}
        <div
          style={{
            width: "100%",
            maxWidth: CARD_MAX_WIDTH,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            marginBottom: 40,
          }}
        >
          {loading && <p style={{color: '#475569', fontWeight: 500, paddingTop: '30px'}}>Fetching doctor list...</p>}
          {error && <p style={{ color: "#e13535", background: '#f8d7da', padding: '15px', borderRadius: '8px', width: '100%' }}>Error: {error}</p>}
          
          {!loading && !error && filteredDoctors.length === 0 && (
            <div
              style={{
                width: "100%",
                background: "#eef3ff",
                borderRadius: "12px",
                padding: "22px",
                textAlign: "center",
                fontWeight: 600,
                color: "#2574fb",
              }}
            >
              No doctors found matching your criteria.
            </div>
          )}

          {!loading &&
            !error &&
            filteredDoctors.map((doctor, idx) => (
              <div
                key={doctor._id || idx}
                // ⭐ APPLYING HOVER ANIMATION AND REFINED STYLES
                style={styles.doctorCard(activeCard === idx)}
                onMouseEnter={() => handleCardEnter(idx)}
                onMouseLeave={handleCardLeave}
              >
                {/* Doctor Info */}
                <div style={{ flex: 1 }}>
                  <div style={styles.doctorName}>Dr. {doctor.name}</div>
                  <div style={styles.specialty}>{doctor.specialty || "General Medicine"}</div>
                  
                  <div style={styles.details}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                      <Clock size={16} color="#475569" /> 
                      Experience:{" "}
                      {doctor.experience != null ? `${doctor.experience} years` : "N/A"}
                    </span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                      <Calendar size={16} color="#475569" /> 
                      Availability: Mon-Fri 9:00-17:00
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  style={styles.bookButton}
                  onClick={() => openModal(doctor)}
                  disabled={booking}
                >
                  <Stethoscope size={18} />
                  Book Appointment
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div style={modalStyles.overlay}>
          <form style={modalStyles.form} onSubmit={handleModalBook}>
            <div style={{...modalStyles.modalTitle, marginBottom: '20px'}}>
              Confirm Booking with Dr. {modalDoctor?.name}
            </div>

            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Date</label>
              <input
                style={modalStyles.input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Time</label>
              <input
                style={modalStyles.input}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div style={modalStyles.inputGroup}>
              <label style={modalStyles.label}>Reason for Visit</label>
              <input
                style={modalStyles.input}
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your reason"
                required
              />
            </div>

            <div style={modalStyles.buttonGroup}>
              <button
                style={modalStyles.modalCancel}
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                style={modalStyles.modalSubmit}
                type="submit"
                disabled={booking}
              >
                {booking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;