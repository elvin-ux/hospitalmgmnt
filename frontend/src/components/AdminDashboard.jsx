import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
// ⭐ Import the AddDoctorModal component (Assuming the file is named AddDoctor.jsx)
import API_BASE_URL from '../api';
import AddDoctorModal from './AddDoctor'; 
import API_BASE_URL from '../api';

// ==========================================
// 1. STYLE OBJECTS
// ==========================================

const styles = {
  // --- Layout & Global ---
  hospitalAdminLayout: {
    display: "flex",
    width: "100vw",
    minHeight: "100vh",
    fontFamily:
      '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    backgroundColor: "#f4f7f9",
  },
  mainContentArea: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  
  // --- Sidebar Styles (Updated to push content/logout apart) ---
  sidebar: {
    width: "250px",
    backgroundColor: "#ffffff",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.05)",
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // PUSHES LOGOUT BUTTON TO BOTTOM
    flexShrink: 0,
  },
  sidebarContent: { // New container for title and nav
    display: "flex",
    flexDirection: "column",
  },
  hospitalTitle: {
    padding: "0 20px 30px",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#334e68",
    borderBottom: "1px solid #ebf1f6",
  },
  portalSubtitle: {
    fontSize: "0.8rem",
    fontWeight: "400",
    color: "#8c98a4",
    marginTop: "5px",
  },
  navMenu: {
    paddingTop: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    color: "#334e68",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.95rem",
    transition: "background-color 0.2s, color 0.2s",
  },
  navItemActive: {
    backgroundColor: "#e1f0ff",
    color: "#007bff",
    borderLeft: "4px solid #007bff",
    paddingLeft: "16px",
  },
  navIcon: {
    marginRight: "15px",
    fontSize: "1.2rem",
  },
  logoutButton: { // Style for the new logout button
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '20px 20px 0 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '600',
    textAlign: 'center',
  },

  // --- Header Styles (Unchanged) ---
  adminHeader: {
    backgroundColor: "#ffffff",
    padding: "15px 30px",
    borderBottom: "1px solid #ebf1f6",
    display: "flex",
    justifyContent: "flex-start", 
    alignItems: "center",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
  },
  headerTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#334e68",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "0.9rem",
    fontWeight: "400",
    color: "#8c98a4",
    margin: "0 0 0 10px",
    flexGrow: 1,
  },
  
  // --- Manage Doctors Body (Unchanged) ---
  adminDashboardBody: {
    padding: "30px",
    flexGrow: 1,
  },
  manageDoctorsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  mainPageTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#334e68",
    margin: 0,
  },
  addDoctorButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 2px 4px rgba(0, 123, 255, 0.2)",
    whiteSpace: 'nowrap', 
  },
  searchAndTableContainer: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  searchInputField: {
    width: "300px",
    padding: "10px 15px",
    marginBottom: "25px",
    border: "1px solid #ccd6e0",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "#334e68",
  },
  
  // --- Doctors Table Styles ---
  doctorsTableWrapper: {
    overflowX: "auto",
  },
  doctorsTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHeader: {
    backgroundColor: "transparent", 
    color: "#6c757d",
    fontWeight: "500",
    padding: "12px 15px",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #ebf1f6", 
  },
  tableCell: {
    padding: "15px",
    color: "#334e68",
    fontSize: "0.95rem",
    borderBottom: "1px solid #ebf1f6",
  },
  doctorNameCell: {
    fontWeight: "600",
    color: "#1e293b",
  },
  actionColumn: {
    width: "80px", 
    textAlign: "center", 
  },
  actionButtonsGroup: {
    display: "flex",
    justifyContent: "center", 
  },
  deleteButton: { 
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    fontSize: '1.2rem', 
    lineHeight: 1,
    color: '#6c757d', 
    transition: 'color 0.15s',
  },
  noDataRow: {
    textAlign: "center",
    padding: "30px",
    color: "#6c757d",
    fontStyle: "italic",
  }
};

// ==========================================
// 2. CHILD COMPONENTS (Sidebar and Header)
// ==========================================

const Sidebar = ({ activeLink, navigate, handleLogout }) => {
  const navItems = [
    // Excluding Dashboard and Reports as requested
    { name: "Manage Patients", icon: "🧑‍🤝‍🧑", path: "/admin/patients" },
    { name: "Manage Doctors", icon: "🩺", path: "/admin/doctors" },
    { name: "Appointments", icon: "📅", path: "/admin/appointments" },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarContent}>
        <div style={styles.hospitalTitle}>
          Hospital System
          <p style={styles.portalSubtitle}>Administration Portal</p>
        </div>
        <nav style={styles.navMenu}>
          {navItems.map((item) => {
            const isActive = activeLink === item.name;
            const itemStyle = isActive
              ? { ...styles.navItem, ...styles.navItemActive }
              : styles.navItem;

            return (
              <div
                key={item.name}
                style={itemStyle}
                onClick={() => navigate(item.path)}
              >
                <span role="img" aria-label={item.name} style={styles.navIcon}>
                  {item.icon}
                </span>
                {item.name}
              </div>
            );
          })}
        </nav>
      </div>
      
      {/* Logout Button */}
      <button 
        style={styles.logoutButton}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

const Header = () => (
  <header style={styles.adminHeader}>
    <h2 style={styles.headerTitle}>Admin Dashboard</h2>
    <p style={styles.headerSubtitle}>System Administrator</p>
  </header>
);


// ==========================================
// 3. MAIN COMPONENT: ManageDoctors
// ==========================================

const ManageDoctors = () => {
  // ⭐ Add state for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchDoctors = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        navigate("/admin/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // ⭐ UPDATED DELETE HANDLER FOR DOCTOR
  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this doctor record?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/delete-doctor/${docId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Success: Alert user and refresh the list
      alert('Doctor record deleted successfully!');
      fetchDoctors(); 
      
    } catch (err) {
      console.error("Deletion error:", err);
      alert("Failed to delete doctor record. Check console and server.");
    }
  };

  // ⭐ Updated logout handler redirects to root `/`
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully.');
    navigate('/'); 
  };
  
  // ⭐ Handler for when a doctor is successfully added via the modal
  const handleDoctorAdded = () => {
    fetchDoctors(); // Refresh the list
    setIsModalOpen(false); // Close the modal
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.hospitalAdminLayout}>
      <Sidebar 
        activeLink="Manage Doctors" 
        navigate={navigate} 
        handleLogout={handleLogout} // Pass the logout function
      />
      <div style={styles.mainContentArea}>
        <Header />
        <div style={styles.adminDashboardBody}>
          <div style={styles.manageDoctorsHeader}>
            <h1 style={styles.mainPageTitle}>Manage Doctors</h1>
            <button
              style={styles.addDoctorButton}
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Doctor
            </button>
          </div>

          <div style={styles.searchAndTableContainer}>
            <input
              type="text"
              placeholder="🔍 Search doctors..."
              style={styles.searchInputField}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div style={styles.doctorsTableWrapper}>
              <table style={styles.doctorsTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Specialization</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Phone</th>
                    <th style={styles.tableHeader}>Experience</th>
                    <th style={{ ...styles.tableHeader, ...styles.actionColumn }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ ...styles.tableCell, ...styles.noDataRow }}>
                        {doctors.length === 0
                          ? "No doctors found in the system."
                          : "No doctors match your search criteria."}
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doc) => (
                      <tr key={doc._id}>
                        <td style={{ ...styles.tableCell, ...styles.doctorNameCell }}>
                          {doc.name || "N/A"}
                        </td>
                        <td style={styles.tableCell}>{doc.specialty || "N/A"}</td> 
                        <td style={styles.tableCell}>{doc.email || "N/A"}</td>
                        <td style={styles.tableCell}>{doc.phone || "+1234567890"}</td>
                        <td style={styles.tableCell}>{doc.experience ? `${doc.experience} years` : "N/A"}</td>
                        <td style={{ ...styles.tableCell, ...styles.actionColumn }}>
                          <div style={styles.actionButtonsGroup}>
                            <button
                              style={styles.deleteButton}
                              title="Delete Doctor"
                              onClick={() => handleDelete(doc._id)}
                            >
                              <span role="img" aria-label="Delete">🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* ⭐ RENDER THE ADD DOCTOR MODAL HERE */}
      {isModalOpen && (
        <AddDoctorModal
          onClose={() => setIsModalOpen(false)}
          onDoctorAdded={handleDoctorAdded}
        />
      )}
    </div>
  );
};

export default ManageDoctors;
