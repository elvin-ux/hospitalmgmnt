import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
import { User, Phone, Mail, MapPin, Heart, Plus, ChevronLeft, Save } from 'lucide-react';
import API_BASE_URL from '../api';

// Base URL for API calls
const API_BASE_URL = `${API_BASE_URL}/api/patient";

// --- Multi-Select Data Arrays for Dropdowns ---
const MEDICAL_DATA = {
  allergies: ['Penicillin', 'Dust Mites', 'Pollen', 'Peanuts', 'Latex', 'Bee Stings'],
  medicalConditions: ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Arthritis', 'Migraines', 'Hypothyroidism'],
  medications: ['Lisinopril', 'Metformin', 'Ibuprofen', 'Amoxicillin', 'Ventolin', 'Levothyroxine'],
};

// ⭐ FIX: Define the required colors object globally for the MultiSelect component
const colors = {
    primary: '#1e293b', 
    // Define tag colors used in the modal if needed, or use them directly in the tagColor prop
};

// ==========================================
// 1. STYLING DEFINITIONS (Professional Overhaul)
// ==========================================
const profileStyles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f1f5f9', // Soft background
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
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
  mainContentArea: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto', // Center the content
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    padding: '30px',
    marginBottom: '30px',
    border: '1px solid #e2e8f0',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
  },
  nameTitle: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  patientId: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  sectionHeader: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '20px',
    marginTop: '10px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  infoItem: {
    padding: '10px 0',
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
    fontSize: '1.1rem',
    color: '#1e293b',
    fontWeight: '600',
  },
  tag: (color) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color,
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginRight: '8px',
    marginBottom: '8px',
    fontWeight: '500',
  }),
  tagGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  saveButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    marginTop: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
  },
};

// ==========================================
// 2. MULTI-SELECT COMPONENT (For medical arrays)
// ==========================================

const MultiSelect = ({ label, name, options, selectedOptions, onChange, tagColor }) => {
    
    const isSelected = (option) => selectedOptions.includes(option);

    const toggleOption = (option) => {
        let newSelection;
        if (isSelected(option)) {
            newSelection = selectedOptions.filter(item => item !== option);
        } else {
            newSelection = [...selectedOptions, option];
        }
        
        // Simulate event structure for the main form handler
        onChange({ 
            target: { 
                name, 
                value: newSelection 
            }
        });
    };
    
    return (
        <div style={profileStyles.infoItem}>
            <label style={{ ...profileStyles.infoLabel, color: tagColor || profileStyles.infoLabel.color }}>
                {label}
            </label>
            <div style={{...profileStyles.tagGroup, marginBottom: '15px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                {options.map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(option)}
                        style={{
                            // Use the defined tagColor for selected state, and primary dark color for unselected text
                            ...profileStyles.tag(isSelected(option) ? tagColor : '#f0f4f8'),
                            color: isSelected(option) ? 'white' : colors.primary, // Using the defined colors.primary
                            padding: '8px 15px',
                            cursor: 'pointer',
                            border: `1px solid ${isSelected(option) ? tagColor : '#e2e8f0'}`,
                            boxShadow: isSelected(option) ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        }}
                    >
                        {option}
                        {isSelected(option) && <Plus size={14} style={{ transform: 'rotate(45deg)', marginLeft: '6px' }} />}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 3. MAIN COMPONENT: PatientProfile
// ==========================================

const PatientProfile = () => {
  const [profile, setProfile] = useState({});
  const [medicalForm, setMedicalForm] = useState({
    allergies: [],
    medicalConditions: [],
    medications: [],
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/patient/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
      
      // Load fetched arrays directly into the medicalForm state
      setMedicalForm({
        allergies: data.allergies || [],
        medicalConditions: data.medicalConditions || [],
        medications: data.medications || [],
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      // Fallback in case of error
      setProfile({ name: 'Error Loading Profile', patientId: 'N/A' }); 
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handler for custom multi-select component updates
  // The 'value' from the MultiSelect is already the array, so we store it directly.
  const handleMedicalFormChange = (e) => {
    const { name, value } = e.target;
    setMedicalForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMedicalUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // The payload is already correctly structured as arrays from the MultiSelect component
    const payload = medicalForm;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/update-medical`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      alert("Medical information updated successfully!");
      fetchProfile(); // Refetch data
      
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to save medical information.");
    } finally {
      setIsSaving(false);
    }
  };

  const personalInfo = [
    { label: 'Age & Gender', value: `${profile.age || 'N/A'} years old, ${profile.gender || 'N/A'}` },
    { label: 'Blood Group', value: profile.bloodGroup || 'N/A' },
  ];

  const contactInfo = [
    { label: 'Phone', icon: Phone, value: profile.phone || 'N/A' },
    { label: 'Email', icon: Mail, value: profile.email || 'N/A' },
    { label: 'Address', icon: MapPin, value: profile.address || 'N/A' },
  ];

  if (loading) {
    return (
      <div style={{ ...profileStyles.container, textAlign: 'center', paddingTop: '100px' }}>
        <h1 style={{ color: profileStyles.nameTitle.color }}>Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div style={profileStyles.container}>
        {/* Top Navigation Bar */}
        <div style={profileStyles.navbar}>
            <button 
                style={profileStyles.backButton}
                onClick={() => navigate('/book-appointment')} // Back button action
            >
                <ChevronLeft size={20} /> Back to Booking
            </button>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#334e68' }}>
                Patient Profile
            </h1>
        </div>

        {/* Main Content */}
        <div style={profileStyles.mainContentArea}>
            
            <div style={profileStyles.card}>
                
                {/* Profile Header */}
                <div style={profileStyles.profileHeader}>
                    <User size={48} style={{ marginRight: '20px', color: '#007bff' }} />
                    <div>
                        <h2 style={profileStyles.nameTitle}>{profile.name || 'Patient Name'}</h2>
                        <span style={profileStyles.patientId}>Patient ID: {profile._id || 'PAT001'}</span>
                    </div>
                </div>

                {/* --- Personal and Contact Information --- */}
                <h3 style={profileStyles.sectionHeader}>Personal & Contact Information</h3>
                
                <div style={profileStyles.infoGrid}>
                    <div>
                        {personalInfo.map((item, index) => (
                            <div key={index} style={profileStyles.infoItem}>
                                <span style={profileStyles.infoLabel}><Heart size={16} /> {item.label}</span>
                                <span style={profileStyles.infoValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div>
                        {contactInfo.map((item, index) => (
                            <div key={index} style={profileStyles.infoItem}>
                                <span style={profileStyles.infoLabel}>
                                    <item.icon size={16} /> {item.label}
                                </span>
                                <span style={profileStyles.infoValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Medical Information (Editable Multi-Select) --- */}
                <h3 style={profileStyles.sectionHeader}>Medical History & Updates</h3>

                <form onSubmit={handleMedicalUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        
                        {/* Allergies */}
                        <MultiSelect
                            label="Allergies"
                            name="allergies"
                            options={MEDICAL_DATA.allergies}
                            selectedOptions={medicalForm.allergies}
                            onChange={handleMedicalFormChange}
                            tagColor="#ef4444" // Red
                        />

                        {/* Medical Conditions */}
                        <MultiSelect
                            label="Medical Conditions"
                            name="medicalConditions"
                            options={MEDICAL_DATA.medicalConditions}
                            selectedOptions={medicalForm.medicalConditions}
                            onChange={handleMedicalFormChange}
                            tagColor="#f97316" // Orange
                        />

                        {/* Medications */}
                        <MultiSelect
                            label="Current Medications"
                            name="medications"
                            options={MEDICAL_DATA.medications}
                            selectedOptions={medicalForm.medications}
                            onChange={handleMedicalFormChange}
                            tagColor="#0ea5e9" // Blue
                        />

                    </div>

                    <button type="submit" style={profileStyles.saveButton} disabled={isSaving}>
                        <Save size={20} />
                        {isSaving ? 'Saving Changes...' : 'Save Medical History'}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default PatientProfile;