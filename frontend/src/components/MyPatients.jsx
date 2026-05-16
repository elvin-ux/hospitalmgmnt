import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
import { Users, Phone, Mail, ChevronLeft, User, Stethoscope } from 'lucide-react';
import API_BASE_URL from '../api';

// ⭐ Import the PatientRecordModal component
import API_BASE_URL from '../api';
import PatientRecordModal from './PatientRecordModal'; 
import API_BASE_URL from '../api';

const API_BASE_URL = `${API_BASE_URL}/api/doctor";

// ==========================================
// 1. PROFESSIONAL STYLING DEFINITIONS
// ==========================================
const styles = {
    // --- Layout & Container ---
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
    navTitle: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 700,
        color: '#1e293b'
    },
    // --- Main Content ---
    contentArea: {
        padding: '30px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    listTitle: {
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#334155',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'baseline',
        gap: '10px',
    },
    countPill: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#3b82f6',
        backgroundColor: '#e1f0ff',
        padding: '4px 12px',
        borderRadius: '20px',
    },
    patientList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    // --- Patient Card Style ---
    patientCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        padding: '20px 25px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        }
    },
    patientName: {
        fontSize: '1.3rem',
        fontWeight: '700',
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    details: {
        fontSize: '0.95rem',
        color: '#475569',
        display: 'flex',
        gap: '25px',
        marginTop: '8px',
    },
    detailItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    actionButton: {
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.2s',
    }
};

// ==========================================
// 2. MAIN COMPONENT: DoctorPatients
// ==========================================

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    // ⭐ State to hold the patient object for the modal
    const [modalPatient, setModalPatient] = useState(null); 
    const navigate = useNavigate();

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/doctor/login");
            return;
        }

        try {
            // ⭐ NOTE: The backend route must return ALL fields needed for the modal (including allergies, meds, address, etc.)
            // The route in server.js should be the one that fetches ALL required patient details for the Doctor view.
            const res = await fetch(`${API_BASE_URL}/patients`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            
            const data = await res.json();
            setPatients(data);
        } catch (err) {
            console.error('Failed to fetch patients:', err);
            alert('Failed to load patient list.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    // ⭐ UPDATED handler to open the modal
    const handleViewRecord = (patient) => {
        // Patient object should contain all details including medical arrays
        setModalPatient(patient); 
    };

    if (loading) {
        return <div style={{ ...styles.container, textAlign: 'center', paddingTop: '100px', fontSize: '1.5rem', color: '#334155' }}>Loading Patient List...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <button 
                    style={styles.backButton} 
                    onClick={() => navigate('/doctor/profile')} // Navigate to doctor profile
                >
                    <ChevronLeft size={20} style={{ marginRight: '5px' }} /> Back
                </button>
                <h1 style={styles.navTitle}>My Patients List</h1>
                {/* Placeholder for visual balance */}
                <div style={{ width: '80px' }}></div> 
            </div>

            <div style={styles.contentArea}>
                <h2 style={styles.listTitle}>
                    Patients Under Care 
                    <span style={styles.countPill}>{patients.length} Total</span>
                </h2>
                
                {patients.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No patients found with scheduled appointments.</p>
                ) : (
                    <div style={styles.patientList}>
                        {patients.map((patient) => (
                            <div 
                                key={patient._id} 
                                style={styles.patientCard}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = styles.patientCard.boxShadow}
                            >
                                {/* Patient Info */}
                                <div>
                                    <div style={styles.patientName}>
                                        <User size={20} color="#1e293b"/>
                                        {patient.name}
                                    </div>
                                    <div style={styles.details}>
                                        <span style={styles.detailItem}><Stethoscope size={16} /> Age: {patient.age || 'N/A'}</span>
                                        <span style={styles.detailItem}><Phone size={16} /> {patient.phone || 'N/A'}</span>
                                        <span style={styles.detailItem}><Mail size={16} /> {patient.email}</span>
                                    </div>
                                </div>
                                
                                {/* Action Button */}
                                <button
                                    onClick={() => handleViewRecord(patient)}
                                    style={styles.actionButton}
                                >
                                    View Record
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ⭐ RENDER THE PATIENT RECORD MODAL */}
            {modalPatient && (
                <PatientRecordModal 
                    patient={modalPatient} 
                    onClose={() => setModalPatient(null)} 
                />
            )}
        </div>
    );
};

export default DoctorPatients;