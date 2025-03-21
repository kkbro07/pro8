import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import api from '../utils/api';

const BidderRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    teamName: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/bidders/register', formData);
      setSuccessMessage(response.data.message);
      setFormData({ name: '', email: '', password: '', teamName: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering bidder');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Bidder Registration</Typography>
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && <Typography color="success">{successMessage}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
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
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Team Name"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default BidderRegister;
