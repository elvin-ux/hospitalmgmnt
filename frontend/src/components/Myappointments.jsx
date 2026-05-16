import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
import { Calendar, Clock, Stethoscope, ChevronLeft, X, ListChecks, Save } from 'lucide-react';
import API_BASE_URL from '../api';

const API_BASE_URL = `${API_BASE_URL}/api/patient";

// ==========================================
// 2. RESCHEDULE MODAL COMPONENT
// ==========================================

const RescheduleModal = ({ appointment, onClose, onRescheduled }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Convert current appt date to YYYY-MM-DD format for input default
    const defaultDate = new Date(appointment.date).toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !time) {
            alert('Please select a new date and time.');
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/reschedule-appointment/${appointment._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ date: date, time: time }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            // Success: Call the parent refresh function and close
            onRescheduled(); 
            alert("Appointment successfully rescheduled!");
        } catch (error) {
            console.error("Reschedule failed:", error);
            alert("Failed to reschedule appointment.");
        } finally {
            setIsSaving(false);
            onClose();
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modalContent}>
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.title}>Reschedule Appointment</h2>
                    <button style={modalStyles.closeButton} onClick={onClose} aria-label="Close Modal">&times;</button>
                </div>
                
                <p style={{...modalStyles.subtitle, marginBottom: '20px'}}>
                    **Dr. {appointment.doctor?.name || 'N/A'}** ({appointment.doctor?.specialty || 'N/A'})
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="newDate">New Date:</label>
                        <input
                            type="date"
                            id="newDate"
                            style={modalStyles.input}
                            value={date}
                            min={defaultDate} // Prevent rescheduling before today
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label} htmlFor="newTime">New Time:</label>
                        <input
                            type="time"
                            id="newTime"
                            style={modalStyles.input}
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={modalStyles.submitButton}
                        disabled={isSaving}
                    >
                        <Save size={18} />
                        {isSaving ? 'Submitting...' : 'Confirm Reschedule'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// ==========================================
// 3. STYLING DEFINITIONS (Base Styles)
// ==========================================

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e1e4e8',
        paddingBottom: '15px',
        marginBottom: '15px',
    },
    title: {
        margin: 0,
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#64748b',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#64748b',
        transition: 'color 0.2s',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '600',
        color: '#334155',
        fontSize: '0.9rem',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        boxSizing: 'border-box',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
    },
    submitButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '15px',
        float: 'right',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
};

const appointmentStyles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f1f5f9',
    padding: '0',
    fontFamily: 'Inter, "Segoe UI", sans-serif',
  },
  // ⭐ IMPROVED NAVBAR STYLE
  navbar: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '40px', // Increased gap
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#64748b', // Subtle gray color
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500', // Medium weight
    transition: 'color 0.2s',
  },
  mainTitle: {
    margin: 0, 
    fontSize: '1.2rem', 
    fontWeight: 700, 
    color: '#1e293b'
  },
  mainContentArea: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  listTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '20px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    padding: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s',
  },
  statusTag: (status) => {
    let colorMap = {
      Scheduled: { bg: '#e1f0ff', text: '#007bff' },
      Confirmed: { bg: '#e1f0ff', text: '#007bff' },
      Pending: { bg: '#fff3cd', text: '#ffc107' },
      Completed: { bg: '#d4edda', text: '#28a745' },
      Cancelled: { bg: '#f8d7da', text: '#dc3545' },
    };
    const { bg, text } = colorMap[status] || { bg: '#f0f4f8', text: '#6c757d' };
    return {
      backgroundColor: bg,
      color: text,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'inline-block',
      marginLeft: '15px',
      textTransform: 'capitalize',
    };
  },
  doctorName: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
  },
  detailText: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '5px',
    marginBottom: '10px',
  },
  dateTime: {
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '10px',
  },
  actionButton: {
    padding: '8px 15px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginLeft: '10px',
    transition: 'background-color 0.2s',
    border: '1px solid',
  },
  rescheduleButton: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  cancelButton: {
    backgroundColor: 'white',
    color: '#dc3545',
    borderColor: '#dc3545',
  }
};

// ==========================================
// 4. MAIN COMPONENT: MyAppointments
// ==========================================

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to control the visibility and data of the Reschedule Modal
  const [rescheduleModalData, setRescheduleModalData] = useState(null); 
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/patient/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Appointments fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  // Handlers
  const handleRescheduleClick = (appointment) => {
    setRescheduleModalData(appointment); // Open modal with appointment data
  };

  const handleCancel = async (apptId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/cancel-appointment/${apptId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        alert("Appointment successfully cancelled!");
        fetchAppointments(); // Refresh list
    } catch (error) {
        console.error("Cancellation failed:", error);
        alert("Failed to cancel appointment.");
    }
  };
  
  // Custom Status component
  const StatusPill = ({ status }) => (
    <span style={appointmentStyles.statusTag(status)}>
      {status}
    </span>
  );

  if (loading) {
    return (
      <div style={{ ...appointmentStyles.container, textAlign: 'center', paddingTop: '100px' }}>
        <h1 style={{ color: appointmentStyles.listTitle.color }}>Loading Appointments...</h1>
      </div>
    );
  }

  return (
    <div style={appointmentStyles.container}>
        {/* Top Navigation Bar */}
        <div style={appointmentStyles.navbar}>
            <button 
                style={appointmentStyles.backButton}
                // ⭐ UPDATED NAVIGATION: Simple back button
                onClick={() => navigate('/book-appointment')} 
            >
                <ChevronLeft size={20} style={{marginRight: '5px'}}/> Back
            </button>
            <h1 style={appointmentStyles.mainTitle}>
                My Appointments
            </h1>
        </div>

      <div style={appointmentStyles.mainContentArea}>
        
        <h1 style={appointmentStyles.listTitle}>
            All Booked Appointments
            <StatusPill status={`${appointments.length} Appointments`} />
        </h1>

        <div style={appointmentStyles.appointmentList}>
          {appointments.length === 0 ? (
            <div style={{...appointmentStyles.card, justifyContent: 'center', color: '#64748b'}}>
                <ListChecks size={24} style={{marginRight: '10px'}} />
                You have no booked appointments.
            </div>
          ) : (
            appointments.map((appt) => (
              <div key={appt._id} style={appointmentStyles.card} 
                   onMouseEnter={(e) => e.currentTarget.style.boxShadow = appointmentStyles.card.boxShadow.replace('4px', '8px')}
                   onMouseLeave={(e) => e.currentTarget.style.boxShadow = appointmentStyles.card.boxShadow}
              >
                
                {/* Left Side: Doctor and Details */}
                <div>
                  <div style={appointmentStyles.doctorName}>
                    Dr. {appt.doctor?.name || "N/A"}
                    <StatusPill status={appt.status} />
                  </div>
                  
                  <p style={appointmentStyles.detailText}>
                    {appt.doctor?.specialty || "N/A"} • {appt.reason}
                  </p>
                  
                  {/* Date and Time */}
                  <div style={appointmentStyles.dateTime}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={18} color="#64748b" /> 
                      {new Date(appt.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={18} color="#64748b" /> 
                      {appt.time}
                    </span>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    
                    {/* Reschedule/Cancel are only available for Scheduled/Pending appts */}
                    {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                        <>
                            {/* Reschedule Button opens the modal */}
                            <button
                                style={{ ...appointmentStyles.actionButton, ...appointmentStyles.rescheduleButton }}
                                onClick={() => handleRescheduleClick(appt)}
                            >
                                Reschedule
                            </button>
                          
                            {/* Cancel Button */}
                            <button
                                style={{ ...appointmentStyles.actionButton, ...appointmentStyles.cancelButton }}
                                onClick={() => handleCancel(appt._id)}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* ⭐ RENDER RESCHEDULE MODAL */}
      {rescheduleModalData && (
        <RescheduleModal
            appointment={rescheduleModalData}
            onClose={() => setRescheduleModalData(null)}
            onRescheduled={() => {
                setRescheduleModalData(null); // Close modal
                fetchAppointments(); // Refresh list after successful reschedule
            }}
        />
      )}
    </div>
  );
};

export default MyAppointments;