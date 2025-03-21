import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Paper, Typography, IconButton, InputAdornment } from '@mui/material';
import Cookies from 'js-cookie';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminLogin = ({ setIsLoggedIn, setIsAdmin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
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
                Cookies.set('admin', 'true', { expires: 7 });
                setIsLoggedIn(true);
                setIsAdmin(true);
                navigate('/dashboard');
            } else {
                setError('Invalid OTP');
            }
        } catch (err) {
            setError('Error verifying OTP');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
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
                        </form>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AdminLogin;