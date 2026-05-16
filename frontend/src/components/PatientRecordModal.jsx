import React from 'react';

// --- Shared Modal Styles ---
const modalStyles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        fontFamily: 'Inter, "Segoe UI", sans-serif',
    },
    modalContent: {
        backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px',
        width: '100%', maxWidth: '650px', boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
        position: 'relative', 
        maxHeight: '80vh', overflowY: 'auto',
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #e1e4e8', paddingBottom: '15px', marginBottom: '15px',
    },
    title: { margin: 0, fontSize: '1.6rem', fontWeight: '700', color: '#1e293b' },
    closeButton: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' },
    sectionHeader: { fontSize: '1.2rem', fontWeight: '600', color: '#334155', marginTop: '20px', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' },
    label: { fontSize: '0.85rem', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' },
    value: { fontSize: '1rem', color: '#1e293b', fontWeight: '500', marginBottom: '15px' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '15px' },
    tagGroup: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' },
    tag: (color) => ({
        display: 'inline-block', backgroundColor: color, color: 'white',
        padding: '5px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500',
    }),
};

// Colors for medical tags (consistent with PatientProfile)
const TAG_COLORS = {
    allergies: '#dc3545', // Red
    conditions: '#ffc107', // Orange/Amber
    medications: '#007bff', // Blue
};

const PatientRecordModal = ({ patient, onClose }) => {
    
    // Function to render tags or a 'None' message
    const renderTags = (data, type) => {
        if (!data || data.length === 0 || (Array.isArray(data) && data.every(d => !d || d.trim() === ''))) {
            return <span style={modalStyles.value}>None reported.</span>;
        }
        return (
            <div style={modalStyles.tagGroup}>
                {data.filter(d => d && d.trim() !== '').map((item, i) => (
                    <span key={i} style={modalStyles.tag(TAG_COLORS[type])}>
                        {item}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modalContent}>
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.title}>Full Patient Record: {patient.name}</h2>
                    <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
                </div>
                
                {/* Basic Info Grid */}
                <div style={modalStyles.infoGrid}>
                    <div>
                        <span style={modalStyles.label}>Age / Blood Group</span>
                        <span style={modalStyles.value}>{patient.age || 'N/A'} / {patient.bloodGroup || 'N/A'}</span>
                    </div>
                    <div>
                        <span style={modalStyles.label}>Phone</span>
                        <span style={modalStyles.value}>{patient.phone || 'N/A'}</span>
                    </div>
                    <div>
                        <span style={modalStyles.label}>Email</span>
                        <span style={modalStyles.value}>{patient.email || 'N/A'}</span>
                    </div>
                    <div style={{gridColumn: '1 / -1'}}>
                        <span style={modalStyles.label}>Address</span>
                        <span style={modalStyles.value}>{patient.address || 'N/A'}</span>
                    </div>
                </div>

                {/* --- Medical History --- */}
                <h3 style={modalStyles.sectionHeader}>Medical History</h3>

                <span style={modalStyles.label}>Allergies</span>
                {renderTags(patient.allergies, 'allergies')}
                
                <span style={modalStyles.label}>Chronic Conditions</span>
                {renderTags(patient.medicalConditions, 'conditions')}
                
                <span style={modalStyles.label}>Current Medications</span>
                {renderTags(patient.medications, 'medications')}

            </div>
        </div>
    );
};

export default PatientRecordModal; 