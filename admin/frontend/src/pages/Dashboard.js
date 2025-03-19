import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { People, Group, Event, AttachMoney } from '@mui/icons-material';
import PageLayout from '../components/PageLayout';
import api from '../utils/api';
import AdminList from '../components/AdminList';

const Dashboard = () => {
    const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);
    const [newAdminData, setNewAdminData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [adminCount, setAdminCount] = useState(0);
    const [playerCount, setPlayerCount] = useState(0);  // Add player count state

    useEffect(() => {
        const fetchAdminCount = async () => {
            try {
                const response = await api.get('/admin/count');
                setAdminCount(response.data.count);
            } catch (error) {
                console.error('Error fetching admin count:', error);
                setError('Failed to load admin count.');
            }
        };
        const fetchPlayerCount = async () => {
            try {
                const response = await api.get('/players/count');
                setPlayerCount(response.data.count);
            } catch (error) {
                console.error('Error fetching player count:', error);
                setError('Failed to load player count.');
            }
        };
        fetchAdminCount();
        fetchPlayerCount();
    }, []);

    const handleAddAdminDialogOpen = () => {
        setAddAdminDialogOpen(true);
    };

    const handleAddAdminDialogClose = () => {
        setAddAdminDialogOpen(false);
        setNewAdminData({ name: '', email: '', password: '' });
        setError('');
        setSuccessMessage('');
    };

    const handleNewAdminDataChange = (e) => {
        setNewAdminData({ ...newAdminData, [e.target.name]: e.target.value });
    };

    const handleCreateNewAdmin = async () => {
        try {
            const response = await api.post('/admin/register', newAdminData);

            if (response.status === 201) {
                setSuccessMessage('Admin added successfully!');
                setAddAdminDialogOpen(false);
                setNewAdminData({ name: '', email: '', password: '' });
            } else {
                setError(response.data.message || 'Failed to add admin');
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            setError(error.response?.data?.message || 'Failed to add admin');
        }
    };

    return (
        <PageLayout>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                <People />
                            </Avatar>
                            <div>
                                <Typography variant="h6">Total Admins</Typography>
                                <Typography variant="subtitle1">{adminCount}</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                <People />
                            </Avatar>
                            <div>
                                <Typography variant="h6">Total Players</Typography>
                                <Typography variant="subtitle1">{playerCount}</Typography>  {/*Display the player count*/}
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                <Group />
                            </Avatar>
                            <div>
                                <Typography variant="h6">Total Teams</Typography>
                                <Typography variant="subtitle1">8</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                <Event />
                            </Avatar>
                            <div>
                                <Typography variant="h6">Active Auctions</Typography>
                                <Typography variant="subtitle1">1</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                <AttachMoney />
                            </Avatar>
                            <div>
                                <Typography variant="h6">Total Budget</Typography>
                                <Typography variant="subtitle1">₹100Cr</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <AdminList />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAddAdminDialogOpen}>
                            Add New Admin
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Recent Auctions
                            </Typography>
                            <List>
                                <ListItem divider>
                                    <ListItemText
                                        primary="IPL Auction 2025"
                                        secondary="Starting in 1 days"
                                    />
                                    <Chip label="Upcoming" color="success" />
                                </ListItem>
                                <ListItem divider>
                                    <ListItemText
                                        primary="IPL Auction 2026"
                                        secondary="Starting in 2 days"
                                    />
                                    <Chip label="Upcoming" color="success" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="IPL Auction 2027"
                                        secondary="Starting in 3 days"
                                    />
                                    <Chip label="Upcoming" color="success" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Top Players
                            </Typography>
                            <List>
                                <ListItem divider>
                                    <ListItemAvatar>
                                        <Avatar>M</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="MS Dhoni"
                                        secondary="CSK"
                                    />
                                    <Typography variant="body2">₹15Cr</Typography>
                                </ListItem>
                                <ListItem divider>
                                    <ListItemAvatar>
                                        <Avatar>V</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Virat Kohli"
                                        secondary="RCB"
                                    />
                                    <Typography variant="body2">₹17Cr</Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>R</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Rohit Sharma"
                                        secondary="MI"
                                    />
                                    <Typography variant="body2">₹16Cr</Typography>
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Dialog open={addAdminDialogOpen} onClose={handleAddAdminDialogClose}>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogContent>
                    {error && <Typography color="error">{error}</Typography>}
                    {successMessage && <Typography color="success">{successMessage}</Typography>}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newAdminData.name}
                        onChange={handleNewAdminDataChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={newAdminData.email}
                        onChange={handleNewAdminDataChange}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={newAdminData.password}
                        onChange={handleNewAdminDataChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddAdminDialogClose}>Cancel</Button>
                    <Button onClick={handleCreateNewAdmin}>Create</Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default Dashboard;