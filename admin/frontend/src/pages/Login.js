// admin/frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Paper, Typography, IconButton, InputAdornment } from '@mui/material';
import Cookies from 'js-cookie';
import PageLayout from '../components/PageLayout';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(600); // 10 minutes in seconds
  const [resendTimer, setResendTimer] = useState(120); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/login', {
        email: formData.email,
        password: formData.password,
      });
      if (response.data.success) {
        setIsOtpSent(true);
        setIsTimerActive(true);
        setOtpTimer(600); // Reset timer to 10 minutes
        setResendTimer(120); // Reset resend timer to 2 minutes
      } else {
        setError(response.data.message || 'Login Failed, Please Try Again');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/verify-otp', {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.data.success) {
        Cookies.set('token', response.data.token, { expires: 7 });
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError('Error verifying OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await api.post('/admin/resend-otp', {
        email: formData.email,
      });
      if (response.data.success) {
        setError('OTP resent to your email.');
        setOtpTimer(600); // Reset timer to 10 minutes
        setResendTimer(120); // Reset resend timer to 2 minutes
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error resending OTP');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    let timer;
    if (isTimerActive && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
      setError('OTP has expired. Please request a new one.');
    }

    let resendTimerInterval;
    if (resendTimer > 0) {
      resendTimerInterval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(resendTimerInterval);
    };
  }, [isTimerActive, otpTimer, resendTimer]);

  return (
    <PageLayout>
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Admin Login
            </Typography>
            {error && <Typography color="error" align="center">{error}</Typography>}
            {!isOtpSent ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <TextField
                  label="OTP"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Verify OTP
                </Button>
                <Typography align="center" style={{ marginTop: '10px' }}>
                  {isTimerActive ? (
                    <span>Time remaining: {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</span>
                  ) : (
                    <span>OTP expired. </span>
                  )}
                  {resendTimer > 0 ? (
                    <span>Resend OTP in {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}</span>
                  ) : (
                    <Button onClick={handleResendOtp} color="primary" style={{ marginLeft: '10px' }}>
                      Resend OTP
                    </Button>
                  )}
                </Typography>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default Login;
