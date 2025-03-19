// src/components/AdminList.js
import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Paper,
    Typography,
    ListItemSecondaryAction
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import api from '../utils/api';  // Assuming you have a base URL

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await api.get('/admin/admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setError('Failed to load admins.');
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        try {
            await api.delete(`/admin/admins/${adminId}`);
            // Refresh the admin list after deletion
            fetchAdmins();
        } catch (error) {
            console.error('Error deleting admin:', error);
            setError(error.response?.data?.message || 'Failed to delete admin');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                All Admins
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <List>
                {admins.map((admin) => (
                    <ListItem divider key={admin._id}>
                        <ListItemAvatar>
                            <Avatar>{admin.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={admin.name}
                            secondary={admin.email}
                        />
                        <ListItemSecondaryAction>
                            {admin.email !== '21bmiit110@gmail.com' && (
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteAdmin(admin._id)}
                                >
                                    <Delete />
                                </IconButton>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default AdminList;