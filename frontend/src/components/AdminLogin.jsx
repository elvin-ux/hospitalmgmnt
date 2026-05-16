import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import API_BASE_URL from '../api';

// --- Define the Premium Color Palette ---
const colors = {
    primary: '#1e293b',
    primaryHover: '#0f172a',
    background: '#f8fafc',
    cardShadow: '0 20px 25px -5px rgba(30, 41, 59, 0.1), 0 8px 10px -6px rgba(30, 41, 59, 0.1)',
    iconBg: '#334155',
};

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, formData);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Invalid credentials',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          px: 4,
          py: 6,
          borderRadius: 3,
          boxShadow: colors.cardShadow,
          mx: 2,
          bgcolor: 'white',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              bgcolor: colors.iconBg,
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <ShieldOutlinedIcon sx={{ color: '#fff', fontSize: 36 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary, fontSize: '1.75rem', mb: 0.5 }}>
            Administrator Login
          </Typography>
          <Typography sx={{ color: '#64748b', fontWeight: 400, fontSize: 15 }}>
            Access your management dashboard
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              sx: { bgcolor: '#fff', borderRadius: 1.5 },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              sx: { bgcolor: '#fff', borderRadius: 1.5 },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mt: 1 }}>
            <FormControlLabel
              control={<Checkbox size="small" sx={{ color: colors.iconBg }} />}
              label={<Typography sx={{ fontSize: 14, color: '#334e68' }}>Remember me</Typography>}
              sx={{ m: 0 }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              background: colors.primary,
              fontWeight: 600,
              py: 1.3,
              fontSize: 16,
              borderRadius: 1.5,
              boxShadow: '0 4px 10px rgba(30, 41, 59, 0.4)',
              textTransform: 'none',
              '&:hover': { background: colors.primaryHover, boxShadow: '0 6px 15px rgba(30, 41, 59, 0.5)' },
            }}
          >
            Access Dashboard
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}