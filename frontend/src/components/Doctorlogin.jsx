import React, { useState } from 'react';
import API_BASE_URL from '../api';
import axios from 'axios'; // ⭐ Imported axios directly
import API_BASE_URL from '../api';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';
import styled from "styled-components";
import API_BASE_URL from '../api';
import { LogIn } from 'lucide-react'; 
import API_BASE_URL from '../api';

// ==========================================
// STYLED COMPONENTS (Unchanged)
// ==========================================

const PrimaryColor = '#1a4b85';
const SecondaryColor = '#3fb7ed';
const BackgroundColor = 'linear-gradient(135deg, #eef7ff 0%, #d5e5f5 100%)';

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${BackgroundColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginBox = styled.div`
  background: #fff;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(26, 75, 133, 0.15);
  max-width: 380px;
  width: 90%;
  border: 1px solid #e1e9f1;
`;

const HeaderIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: ${SecondaryColor};
`;

const Title = styled.h2`
  color: ${PrimaryColor};
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 800;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: #6b7a90;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  padding: 1rem 1.2rem;
  border-radius: 10px;
  border: 1.5px solid #d8e3f2;
  font-size: 1rem;
  background: #f9fbfd;
  color: ${PrimaryColor};
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid ${SecondaryColor};
    box-shadow: 0 0 0 3px rgba(63, 183, 237, 0.2);
    background: #fff;
  }
`;

const Button = styled.button`
  background-color: ${SecondaryColor};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.15rem;
  font-weight: 700;
  padding: 1rem 0;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(63, 183, 237, 0.3);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:hover {
    background-color: #30a5d4;
    transform: translateY(-1px);
  }
`;

const Message = styled.p`
  text-align: center;
  padding-top: 1.5rem;
  color: ${props => (props.$success ? "#198754" : "#dc3545")};
  font-size: 1rem;
  min-height: 1.6em;
`;

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ⭐ DIRECT AXIOS CALL to the full endpoint
      const res = await axios.post(`${API_BASE_URL}/api/doctor/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");

      setTimeout(() => {
        // Assuming the Doctor's dashboard/profile route is '/doctor/profile'
        navigate("/doctor/profile"); 
      }, 500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || "❌ Invalid email or password";
      setMessage(errorMessage);
    }
  };

  return (
    <Container>
      <LoginBox>
        <HeaderIcon>
            <LogIn size={48} />
        </HeaderIcon>
        <Title>Welcome, Doctor</Title>
        <Subtitle>Sign in to your professional portal.</Subtitle>
        
        <StyledForm onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">
            <LogIn size={20} />
            Secure Login
          </Button>
        </StyledForm>
        <Message $success={message.includes("success")}>{message}</Message>
      </LoginBox>
    </Container>
  );
}