// // Register.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
// import Cookies from 'js-cookie';
// import PageLayout from '../components/PageLayout';

// const Register = ({ setIsLoggedIn }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/register`, formData);  //Updated URL
//       const token = response.data.token;

//       Cookies.set('token', token, { expires: 7 });
//       setIsLoggedIn(true);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <PageLayout>
//       <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
//         <Grid item xs={12} sm={8} md={6} lg={4}>
//           <Paper elevation={3} style={{ padding: '20px' }}>
//             <Typography variant="h5" align="center" gutterBottom>
//               Admin Register
//             </Typography>
//             {error && <Typography color="error" align="center">{error}</Typography>}
//             <form onSubmit={handleSubmit}>
//               <TextField
//                 label="Name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 required
//               />
//               <TextField
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 required
//               />
//               <TextField
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 required
//               />
//               <Button variant="contained" color="primary" type="submit" fullWidth>
//                 Register
//               </Button>
//             </form>
//           </Paper>
//         </Grid>
//       </Grid>
//     </PageLayout>
//   );
// };

// export default Register;