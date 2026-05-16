import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';

// ==========================================
// 1. STYLE OBJECTS (Unchanged)
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
  
  // --- Sidebar Styles ---
  sidebar: {
    width: "250px",
    backgroundColor: "#ffffff",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.05)",
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", 
    flexShrink: 0,
  },
  sidebarContent: {
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
  logoutButton: {
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
    '&:hover': {
      backgroundColor: '#c82333', // Darker red on hover (CSS-in-JS limitation applies)
    },
  },
  
  // --- Header Styles (Shared) ---
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
  
  // --- Appointment Body ---
  adminDashboardBody: {
    padding: "30px",
    flexGrow: 1,
  },
  mainPageTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#334e68",
    margin: 0,
    marginBottom: "20px",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  
  // --- Appointments Table Styles ---
  tableWrapper: {
    overflowX: "auto",
  },
  appointmentsTable: {
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
  nameCell: {
    fontWeight: "600",
    color: "#1e293b",
  },
  statusCell: (status) => {
    let color, bgColor;
    if (status === 'Scheduled') {
        color = '#007bff';
        bgColor = '#e1f0ff';
    } else if (status === 'Completed') {
        color = '#28a745';
        bgColor = '#d4edda';
    } else if (status === 'Cancelled') {
        color = '#dc3545';
        bgColor = '#f8d7da';
    } else {
        color = '#6c757d';
        bgColor = '#f8f9fa';
    }
    return {
        fontWeight: '500',
        padding: '4px 10px',
        borderRadius: '4px',
        color: color,
        backgroundColor: bgColor,
        display: 'inline-block',
        fontSize: '0.85rem',
    };
  },
  actionColumn: {
    width: "80px", 
    textAlign: "center", 
  },
  // Refined delete button style (icon will still be 🗑️)
  deleteButton: { 
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    fontSize: '1.2rem', // Slightly larger icon
    lineHeight: 1,
    color: '#6c757d', // Start with a subtle gray
    transition: 'color 0.15s',
    '&:hover': {
      color: '#dc3545', // Red on hover (CSS-in-JS limitation applies)
    }
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
    { name: "Manage Patients", icon: "🧑‍🤝‍🧑", path: "/admin/patients" },
    { name: "Manage Doctors", icon: "🩺", path: "/dashboard" },
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
// 3. MAIN COMPONENT: ManageAppointments (UPDATED LOGIC)
// ==========================================

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        navigate("/admin/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ⭐ UPDATED DELETE HANDLER WITH BACKEND CONNECTION
  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/delete-appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Success! Refresh the list by calling fetchAppointments again
      alert('Appointment deleted successfully!');
      fetchAppointments(); 
      
    } catch (err) {
      console.error("Deletion error:", err);
      alert("Failed to delete appointment. Check console for details.");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully.');
    navigate('/admin/login');
  };

  return (
    <div style={styles.hospitalAdminLayout}>
      <Sidebar 
        activeLink="Appointments" 
        navigate={navigate}
        handleLogout={handleLogout}
      />
      <div style={styles.mainContentArea}>
        <Header />
        <div style={styles.adminDashboardBody}>
          <h1 style={styles.mainPageTitle}>All Appointments</h1>

          <div style={styles.tableCard}>
            <div style={styles.tableWrapper}>
              <table style={styles.appointmentsTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Patient</th>
                    <th style={styles.tableHeader}>Doctor</th>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>Time</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={{ ...styles.tableHeader, ...styles.actionColumn }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ ...styles.tableCell, ...styles.noDataRow }}>
                        No appointments found in the system.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td style={{ ...styles.tableCell, ...styles.nameCell }}>
                          {appt.patient?.name || "N/A"}
                        </td>
                        <td style={styles.tableCell}>
                          {appt.doctor?.name || "N/A"}
                        </td>
                        <td style={styles.tableCell}>
                          {new Date(appt.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                        </td>
                        <td style={styles.tableCell}>{appt.time || "N/A"}</td>
                        <td style={styles.tableCell}>
                          <span style={styles.statusCell(appt.status)}>
                            {appt.status}
                          </span>
                        </td>
                        <td style={{ ...styles.tableCell, ...styles.actionColumn }}>
                          {/* Using the refined delete button style */}
                          <button
                            style={styles.deleteButton} 
                            title="Delete Appointment"
                            onClick={() => handleDelete(appt._id)}
                          >
                            <span role="img" aria-label="Delete">🗑️</span>
                          </button>
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
    </div>
  );
};

export default ManageAppointments;