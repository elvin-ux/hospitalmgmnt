import { useState, useEffect } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import API_BASE_URL from '../api';

export default function PatientRegister({ switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    address: "",
    phone: "",
    bloodGroup: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(res.ok ? "✅ Registration successful!" : "❌ " + (data.error || "Failed!"));
      if (res.ok) {
        navigate("/login");  // Navigate after successful registration
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error!");
    }
  };

  return (
    <div style={background}>
      <form
        style={{
          ...container,
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(20px)",
        }}
        onSubmit={handleSubmit}
      >
        <div style={iconContainer} aria-hidden="true">📝</div>
        <h2 style={title}>Patient Registration</h2>
        {["name", "email", "password", "age", "address", "phone", "bloodGroup"].map(
          (field) => (
            <div
              key={field}
              style={{ position: field === "password" ? "relative" : "static", marginBottom: "24px" }}
            >
              <label htmlFor={field} style={label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                style={input}
                type={
                  field === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field === "age"
                    ? "number"
                    : "text"
                }
                id={field}
                name={field}
                placeholder={field === "bloodGroup" ? "e.g., A+" : `Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#3a7bd5";
                  e.target.style.boxShadow = "inset 0 0 8px rgba(58, 123, 213, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#bbb";
                  e.target.style.boxShadow = "none";
                }}
              />
              {field === "password" && (
                <span
                  style={eye}
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowPassword(!showPassword);
                    }
                  }}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              )}
            </div>
          )
        )}
        <button
          style={btn}
          type="submit"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2a5aa4";
            e.currentTarget.style.boxShadow = "0 10px 20px rgba(42, 90, 164, 0.6)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3a7bd5";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(58, 123, 213, 0.4)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Register
        </button>
        <p style={switchText}>
          Already have an account?{" "}
          <span
            style={link}
            onClick={switchToLogin}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                switchToLogin();
              }
            }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};




const background = {
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(135deg, #a9c9ff 0%, #d0e7ff 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "auto",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#fff",
  width: "400px",
  maxHeight: "90vh",
  padding: "40px 45px",
  borderRadius: "22px",
  boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
  textAlign: "center",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  overflowY: "auto",
  transition: "opacity 0.5s ease, transform 0.5s ease",
  opacity: 0,
  transform: "translateY(20px)",
};

const iconContainer = {
  fontSize: "56px",
  marginBottom: "16px",
  color: "#3a7bd5",
  userSelect: "none",
};

const title = {
  color: "#1a1a1a",
  marginBottom: "28px",
  fontSize: "2.2rem",
  fontWeight: "700",
};

const label = {
  display: "block",
  textAlign: "left",
  color: "#222",
  fontWeight: "700",
  marginBottom: "8px",
  userSelect: "none",
  fontSize: "1rem",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1.8px solid #bbb",
  fontSize: "17px",
  outlineOffset: "3px",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  color: "#333",
  fontWeight: "500",
  "::placeholder": {
    color: "#aaa",
  },
};

const eye = {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  userSelect: "none",
  fontSize: "20px",
  color: "#666",
  borderRadius: "50%",
  padding: "2px",
  transition: "background-color 0.3s ease",
  userSelect: "none",
};

const btn = {
  width: "100%",
  padding: "16px",
  marginTop: "14px",
  border: "none",
  borderRadius: "14px",
  backgroundColor: "#3a7bd5",
  color: "#fff",
  fontSize: "20px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(58, 123, 213, 0.5)",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
};

const switchText = {
  marginTop: "24px",
  color: "#444",
  fontSize: "1.1rem",
  fontWeight: "600",
};

const link = {
  color: "#2a5aa4",
  cursor: "pointer",
  fontWeight: "800",
  textDecoration: "underline",
  userSelect: "none",
};