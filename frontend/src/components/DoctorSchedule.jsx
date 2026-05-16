import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
import { Calendar, Clock, Stethoscope, ChevronLeft, User, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import API_BASE_URL from '../api';

const API_BASE_URL = `${API_BASE_URL}/api/doctor";

// ==========================================
// 1. PROFESSIONAL STYLING DEFINITIONS
// ==========================================
const styles = {
    container: {
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8fafc', 
        padding: '0',
        fontFamily: 'Inter, "Segoe UI", sans-serif',
    },
    navbar: {
        backgroundColor: '#ffffff',
        padding: '15px 30px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        color: '#64748b', 
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'color 0.2s',
        padding: '5px 0',
    },
    mainTitle: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 700,
        color: '#1e293b'
    },
    // --- Main Content ---
    contentArea: { padding: '30px', maxWidth: '1000px', margin: '0 auto' },
    listTitle: { 
        fontSize: '1.8rem', 
        fontWeight: 700, 
        color: '#334155', 
        marginBottom: '25px' 
    },
    appointmentList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    // --- Appointment Card Style ---
    apptCard: (status) => ({
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        padding: '25px 30px',
        borderLeft: `5px solid ${status === 'Scheduled' || status === 'Confirmed' ? '#007bff' : status === 'Completed' ? '#28aa45' : '#dc3545'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        }
    }),
    patientName: { 
        fontSize: '1.4rem', 
        fontWeight: '600', 
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '5px'
    },
    apptDetail: { 
        fontSize: '0.95rem', 
        color: '#475569', 
        display: 'flex', 
        gap: '20px', 
        marginTop: '10px' 
    },
    detailItem: {
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px'
    },
    reason: {
        fontSize: '1rem',
        color: '#334155',
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
    },
    statusTag: (status) => {
        let colorMap = { Scheduled: '#007bff', Confirmed: '#007bff', Pending: '#ffc107', Completed: '#28a745', Cancelled: '#dc3545' };
        let bgColorMap = { Scheduled: '#e1f0ff', Confirmed: '#e1f0ff', Pending: '#fff3cd', Completed: '#d4edda', Cancelled: '#f8d7da' };
        return {
            backgroundColor: bgColorMap[status] || '#f0f4f8',
            color: colorMap[status] || '#6c757d',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginLeft: '10px',
            textTransform: 'uppercase',
        };
    },
    noAppointments: {
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#64748b',
    }
};

// ==========================================
// 2. MAIN COMPONENT: DoctorSchedule
// ==========================================

const DoctorSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/doctor/login");
            return;
        }

        try {
            // Using the secure route to fetch doctor's appointments
            const res = await fetch(`${API_BASE_URL}/appointments`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            
            const data = await res.json();
            setAppointments(data);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
            alert('Failed to load schedule.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleAction = (appt, action) => {
        alert(`${action} appointment with Patient ${appt.patient.name}`);
        // Implementation for Complete/Cancel actions would go here (PUT/PATCH calls)
    };

    // Custom Status component
    const StatusPill = ({ status }) => (
        <span style={styles.statusTag(status)}>
            {status}
        </span>
    );

    if (loading) {
        return <div style={{ ...styles.container, textAlign: 'center', paddingTop: '100px', fontSize: '1.5rem', color: '#334155' }}>Loading Schedule...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <button 
                    style={styles.backButton} 
                    onClick={() => navigate('/doctor/profile')} // Back to Doctor Profile
                >
                    <ChevronLeft size={20} style={{ marginRight: '5px' }} /> Back to Profile
                </button>
                <h1 style={styles.mainTitle}>Appointment Schedule</h1>
                {/* Placeholder for visual balance */}
                <div style={{ width: '150px' }}></div> 
            </div>

            <div style={styles.contentArea}>
                <h2 style={styles.listTitle}>
                    All Appointments ({appointments.length})
                </h2>
                
                <div style={styles.appointmentList}>
                    {appointments.length === 0 ? (
                        <div style={styles.noAppointments}>
                            <XCircle size={24} style={{ marginBottom: '10px' }} color="#dc3545" />
                            <p>No appointments found in your schedule.</p>
                        </div>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt._id} 
                                style={styles.apptCard(appt.status)}
                                // Applying simple hover effect via inline function
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = styles.apptCard().boxShadow}
                            >
                                {/* Left Side: Patient and Details */}
                                <div>
                                    <div style={styles.patientName}>
                                        <User size={20} color="#1e293b" />
                                        {appt.patient?.name || 'Unknown Patient'}
                                        <StatusPill status={appt.status} />
                                    </div>
                                    
                                    <div style={styles.reason}>
                                        <MessageSquare size={16} color="#334155" />
                                        Reason: {appt.reason}
                                    </div>

                                    <div style={styles.apptDetail}>
                                        <span style={styles.detailItem}>
                                            <Calendar size={16} color="#64748b" /> 
                                            {new Date(appt.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                        </span>
                                        <span style={styles.detailItem}>
                                            <Clock size={16} color="#64748b" /> 
                                            {appt.time}
                                        </span>
                                        <span style={styles.detailItem}>
                                            <Stethoscope size={16} color="#64748b" /> 
                                            Patient Contact: {appt.patient?.phone || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Right Side: Status Icon */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    {appt.status === 'Completed' ? (
                                        <CheckCircle size={32} color="#28a745" title="Consult Completed" />
                                    ) : appt.status === 'Cancelled' ? (
                                        <XCircle size={32} color="#dc3545" title="Appointment Cancelled" />
                                    ) : (
                                        // ⭐ FIX APPLIED HERE: The ternary expression is correctly closed
                                        <Clock size={32} color="#007bff" title="Scheduled/Pending" />
                                    )} 
                                </div>
                            </div>
                        )))}
                    </div>
                
            </div>
        </div>
    );
};

export default DoctorSchedule;