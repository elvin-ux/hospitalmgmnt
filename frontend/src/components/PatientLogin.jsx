import { useState, useEffect } from "react";
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';

export default function PatientLogin() {
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Sign-in successful!");
        localStorage.setItem("token", data.token);
        navigate("/book-appointment");
      } else {
        alert("❌ " + (data.error || "Sign-in failed!"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error!");
    }
  };

  const handleNavigateRegister = () => {
    navigate("/register");
  };

  return (
    <div style={background}>
      <form
        style={{ ...container, opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(20px)" }}
        onSubmit={handleSubmit}
      >
        <div style={iconContainer} aria-hidden="true">👤</div>
        <h2 style={title}>Patient Login</h2>
        <p style={subtitle}>Book appointment and manage your health records easily.</p>
        <label style={label} htmlFor="email">Email</label>
        <input
          style={input}
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
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
        <label style={label} htmlFor="password">Password</label>
        <div style={{ position: "relative" }}>
          <input
            style={input}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
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
          <span
            style={eye}
            onClick={() => setShowPassword(!showPassword)}
            role="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
            }}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>
        <div style={checkboxContainer}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="rememberMe" style={{ marginLeft: "8px", userSelect: "none", color: "#222" }}>
            Remember Me
          </label>
        </div>
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
          Sign In
        </button>
        <p style={switchText}>
          Don't have an account?{" "}
          <span
            style={link}
            onClick={handleNavigateRegister}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleNavigateRegister();
              }
            }}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}


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
  width: "380px",
  padding: "40px 45px",
  borderRadius: "22px",
  boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
  textAlign: "center",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
  marginBottom: "8px",
  fontSize: "1.8rem",
  fontWeight: "700",
};

const subtitle = {
  fontSize: "1rem",
  color: "#555",
  marginBottom: "24px",
  fontWeight: "400",
  lineHeight: "1.4",
  userSelect: "none",
};

const label = {
  display: "block",
  textAlign: "left",
  color: "#222",
  fontWeight: "600",
  marginBottom: "6px",
  userSelect: "none",
  fontSize: "0.95rem",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1.8px solid #bbb",
  fontSize: "16px",
  outlineOffset: "3px",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  color: "#333",
  fontWeight: "500",
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
};

const checkboxContainer = {
  display: "flex",
  alignItems: "center",
  marginBottom: "24px",
  justifyContent: "flex-start",
};

const btn = {
  width: "100%",
  padding: "16px",
  marginTop: "12px",
  border: "none",
  borderRadius: "14px",
  backgroundColor: "#3a7bd5",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(58, 123, 213, 0.5)",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
};

const switchText = {
  marginTop: "20px",
  color: "#444",
  fontSize: "1rem",
  fontWeight: "600",
};

const link = {
  color: "#2a5aa4",
  cursor: "pointer",
  fontWeight: "700",
  textDecoration: "underline",
  userSelect: "none",
};