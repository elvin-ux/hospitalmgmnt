import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
// ⭐ Icon Imports
import { Stethoscope, Phone, Mail, MapPin, Briefcase, GraduationCap, Users, LogOut, ChevronRight, CalendarCheck } from 'lucide-react';
import API_BASE_URL from '../api';

const API_BASE_URL = `${API_BASE_URL}/api/doctor";

// Placeholder data for fields not in your Mongoose schema
const PLACEHOLDERS = {
  education: "MD from Reputable Medical School",
  address: "123 Medical Center Drive, City, State 12345"
};

// ==========================================
// 1. STYLING DEFINITIONS (Professional and Consistent)
// ==========================================
const profileStyles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f8fafc',
    padding: '0',
    fontFamily: 'Inter, "Segoe UI", sans-serif',
  },
  // --- Navbar Style ---
  navbar: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  navGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  navTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1e293b'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  // --- Main Card Layout ---
  mainContentArea: {
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    padding: '40px 30px',
    marginBottom: '30px',
    border: '1px solid #e2e8f0',
  },
  // --- Profile Section ---
  profileSection: {
    borderBottom: '1px solid #ebf1f6',
    paddingBottom: '30px',
    marginBottom: '30px',
  },
  doctorHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px',
  },
  doctorIconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#e5f1ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '20px',
    color: '#007bff',
  },
  doctorName: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  specialty: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#3b82f6',
    marginTop: '4px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px 40px',
    paddingTop: '20px',
  },
  sectionSubtitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '15px',
  },
  infoItem: {
    marginBottom: '20px',
  },
  infoLabel: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#94a3b8',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: '600',
    marginTop: '4px',
  },
  // --- Metrics Section ---
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginTop: '20px',
  },
  metricBox: (color) => {
    let baseStyle = {
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
    };
    if (color === 'blue') return { ...baseStyle, backgroundColor: '#e1f0ff' };
    if (color === 'red') return { ...baseStyle, backgroundColor: '#f8d7da' };
    if (color === 'green') return { ...baseStyle, backgroundColor: '#d4edda' };
    return baseStyle;
  },
  metricValue: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: '#475569',
    fontWeight: '500',
  },
};


// ==========================================
// 2. MAIN COMPONENT: DoctorProfile
// ==========================================

const DoctorProfile = () => {
  const [profile, setProfile] = useState({});
  const [metrics, setMetrics] = useState({ totalPatients: 0, totalAppointments: 0, pendingAppointments: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/doctor/login");
      return;
    }
    try {
      // Fetch Profile Data
      const profileRes = await fetch(`${API_BASE_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const profileData = await profileRes.json();

      // Fetch Metrics Data
      const metricsRes = await fetch(`${API_BASE_URL}/metrics`, { headers: { Authorization: `Bearer ${token}` } });
      const metricsData = await metricsRes.json();

      if (!profileRes.ok || !metricsRes.ok) {
        throw new Error("Failed to fetch data.");
      }

      setProfile(profileData);
      setMetrics(metricsData);
    } catch (err) {
      console.error("Data fetch error:", err);
      setProfile({ name: 'Error', specialty: 'N/A' });
      setMetrics({ totalPatients: 0, totalAppointments: 0, pendingAppointments: 0 });
      alert("Failed to load doctor data. Please log in again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div style={{ ...profileStyles.container, textAlign: 'center', paddingTop: '100px' }}>
        <h1 style={{ color: profileStyles.navTitle.color }}>Loading Doctor Profile...</h1>
      </div>
    );
  }

  return (
    <div style={profileStyles.container}>
      {/* Top Navigation Bar */}
      <div style={profileStyles.navbar}>
        <h1 style={profileStyles.navTitle}>Doctor Portal</h1>
        <div style={profileStyles.navGroup}>
          {/* My Patients Button */}
          <button
            style={{ ...profileStyles.navButton, color: '#3b82f6' }}
            onClick={() => navigate('/doctor/patients')}
            title="View Patient List"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e1f0ff'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Users size={16} style={{ marginRight: '5px' }} /> My Patients
          </button>
          {/* Schedule Button */}
          <button
            style={{ ...profileStyles.navButton, color: '#3b82f6' }}
            onClick={() => navigate('/doctor/schedule')}
            title="View Schedule"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e1f0ff'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <CalendarCheck size={16} style={{ marginRight: '5px' }} /> Work Schedule
          </button>
          {/* Logout Button */}
          <button
            style={{ ...profileStyles.navButton, color: '#dc3545' }}
            onClick={handleLogout}
            title="Logout"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8d7da'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={16} style={{ marginRight: '5px' }} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={profileStyles.mainContentArea}>
        <div style={profileStyles.card}>
          {/* Doctor Header */}
          <div style={profileStyles.profileSection}>
            <div style={profileStyles.doctorHeader}>
              <div style={profileStyles.doctorIconBox}>
                <Stethoscope size={30} />
              </div>
              <div>
                <h2 style={profileStyles.doctorName}>Dr. {profile.name || 'N/A'}</h2>
                <p style={profileStyles.specialty}>{profile.specialty || 'General Practice'}</p>
              </div>
            </div>
            {/* Profile & Contact Info Grid */}
            <div style={profileStyles.infoGrid}>
              {/* Professional Info */}
              <div>
                <h3 style={profileStyles.sectionSubtitle}>Professional Information</h3>
                <div style={profileStyles.infoItem}>
                  <span style={profileStyles.infoLabel}><Briefcase size={16} /> Experience</span>
                  <span style={profileStyles.infoValue}>{profile.experience || 0} years</span>
                </div>
                <div style={profileStyles.infoItem}>
                  <span style={profileStyles.infoLabel}><GraduationCap size={16} /> Education</span>
                  <span style={profileStyles.infoValue}>{PLACEHOLDERS.education}</span>
                </div>
              </div>
              {/* Contact Info */}
              <div>
                <h3 style={profileStyles.sectionSubtitle}>Contact Information</h3>
                <div style={profileStyles.infoItem}>
                  <span style={profileStyles.infoLabel}><Phone size={16} /> Phone</span>
                  <span style={profileStyles.infoValue}>{profile.phone || 'N/A'}</span>
                </div>
                <div style={profileStyles.infoItem}>
                  <span style={profileStyles.infoLabel}><Mail size={16} /> Email</span>
                  <span style={profileStyles.infoValue}>{profile.email || 'N/A'}</span>
                </div>
                <div style={profileStyles.infoItem}>
                  <span style={profileStyles.infoLabel}><MapPin size={16} /> Address</span>
                  <span style={profileStyles.infoValue}>{PLACEHOLDERS.address}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Dashboard Metrics */}
          <h3 style={{ ...profileStyles.sectionSubtitle, marginTop: '10px' }}>Dashboard Metrics</h3>
          <div style={profileStyles.metricsGrid}>
            {/* Total Patients */}
            <div style={profileStyles.metricBox('blue')}>
              <div style={profileStyles.metricValue}>{metrics.totalPatients}</div>
              <div style={profileStyles.metricLabel}>Total Patients</div>
            </div>
            {/* Total Appointments */}
            <div style={profileStyles.metricBox('blue')}>
              <div style={profileStyles.metricValue}>{metrics.totalAppointments}</div>
              <div style={profileStyles.metricLabel}>Total Appointments</div>
            </div>
            {/* Pending Appointments */}
            <div style={profileStyles.metricBox('red')}>
              <div style={profileStyles.metricValue}>{metrics.pendingAppointments}</div>
              <div style={profileStyles.metricLabel}>Pending Consults</div>
            </div>
            {/* Total Consultations */}
            <div style={profileStyles.metricBox('green')}>
              <div style={profileStyles.metricValue}>{metrics.totalAppointments}</div>
              <div style={profileStyles.metricLabel}>Total Consultations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
