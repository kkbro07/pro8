// src/pages/PlayerManagement.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Importing API utility for making HTTP requests
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography, // Import Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PageLayout from '../components/PageLayout'; // Importing a layout component for consistent UI

const PlayerManagement = () => {
    const [players, setPlayers] = useState([]); // A state variable to hold the list of players
    const [newPlayer, setNewPlayer] = useState({ // A state variable to hold the new player form
        name: '',
        basePrice: '',
        statistics: '',
        imageUrl: ''
    });
    const [editingPlayerId, setEditingPlayerId] = useState(null); // A state variable to hold the ID of the player being edited
    const [editedPlayer, setEditedPlayer] = useState({ // A state variable to hold the edited player form
        name: '',
        basePrice: '',
        statistics: '',
        imageUrl: ''
    });
    const [error, setError] = useState(''); // A state variable to hold any error messages

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await api.get('/players'); // Using the API utility to fetch players from the backend
            setPlayers(response.data); // Updating the state with fetched player data
        } catch (error) {
            console.error('Error fetching players:', error); // Logging any errors that occur during the fetch
            setError('Error fetching players'); // Setting an error message to display to the user
        }
    };

    const handleInputChange = (event) => {
        setNewPlayer({ ...newPlayer, [event.target.name]: event.target.value });
    };

    const handleAddPlayer = async () => {
        try {
            await api.post('/players', newPlayer); // Using the API utility to post the new player to the backend
            fetchPlayers(); // Refreshing the player list
            setNewPlayer({ name: '', basePrice: '', statistics: '', imageUrl: '' }); // Clearing the form
        } catch (error) {
            console.error('Error adding player:', error); // Logging any errors that occur during the add
            setError('Error adding player'); // Setting an error message to display to the user
        }
    };

    const handleEditPlayer = (player) => {
        setEditingPlayerId(player._id); // Setting the editing player ID
        setEditedPlayer({ ...player }); // Setting the edited player state to the selected player
    };

    const handleEditedInputChange = (event) => {
        setEditedPlayer({ ...editedPlayer, [event.target.name]: event.target.value }); // Updating the edited player state
    };

    const handleUpdatePlayer = async () => {
        try {
            await api.put(`/players/${editingPlayerId}`, editedPlayer); // Using the API utility to update the player
            fetchPlayers(); // Refreshing the player list
            setEditingPlayerId(null); // Clearing the editing state
            setEditedPlayer({ name: '', basePrice: '', statistics: '', imageUrl: '' }); // Clearing the form
        } catch (error) {
            console.error('Error updating player:', error); // Logging any errors that occur during the update
            setError('Error updating player'); // Setting an error message to display to the user
        }
    };

    const handleDeletePlayer = async (id) => {
        try {
            await api.delete(`/players/${id}`); // Using the API utility to delete the player
            fetchPlayers(); // Refreshing the player list
        } catch (error) {
            console.error('Error deleting player:', error); // Logging any errors that occur during the delete
            setError('Error deleting player'); // Setting an error message to display to the user
        }
    };

    return (
        <PageLayout> {/* Wrapping the content with the layout component */}
            <Typography variant="h4" gutterBottom>
                Player Management
            </Typography>
            {error && <Typography color="error">{error}</Typography>} {/* Display error message if there's an error */}
            {/* Add Player Form */}
            <TextField label="Name" name="name" value={newPlayer.name} onChange={handleInputChange} />
            <TextField label="Base Price" name="basePrice" value={newPlayer.basePrice} onChange={handleInputChange} />
            <TextField label="Performance Statistics" name="statistics" value={newPlayer.statistics} onChange={handleInputChange} />
            <TextField label="Image URL" name="imageUrl" value={newPlayer.imageUrl} onChange={handleInputChange} />
            <Button variant="contained" color="primary" onClick={handleAddPlayer}>
                Add Player
            </Button>

            {/* Player List */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Base Price</TableCell>
                            <TableCell align="right">Performance Statistics</TableCell>
                            <TableCell align="right">Image URL</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player) => (
                            <TableRow
                                key={player._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {player.name}
                                </TableCell>
                                <TableCell align="right">{player.basePrice}</TableCell>
                                <TableCell align="right">{player.statistics}</TableCell>
                                <TableCell align="right">{player.imageUrl}</TableCell>
                                <TableCell align="right">
                                    {editingPlayerId === player._id ? (
                                        <>
                                            <TextField label="Name" name="name" value={editedPlayer.name} onChange={handleEditedInputChange} />
                                            <TextField label="Base Price" name="basePrice" value={editedPlayer.basePrice} onChange={handleEditedInputChange} />
                                            <TextField label="Performance Statistics" name="statistics" value={editedPlayer.statistics} onChange={handleEditedInputChange} />
                                            <TextField label="Image URL" name="imageUrl" value={editedPlayer.imageUrl} onChange={handleEditedInputChange} />
                                            <Button variant="contained" color="primary" onClick={handleUpdatePlayer}>Update</Button>
                                            <Button onClick={() => setEditingPlayerId(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton aria-label="edit" onClick={() => handleEditPlayer(player)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => handleDeletePlayer(player._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </PageLayout>
    );
};

export default PlayerManagement;