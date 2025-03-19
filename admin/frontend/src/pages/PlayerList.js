import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Importing API utility for making HTTP requests
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    //IconButton,Remove This
    Typography, // Import Typography
} from '@mui/material';
//import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'; //Remove This
import PageLayout from '../components/PageLayout'; // Importing a layout component for consistent UI

const PlayerList = () => {
    const [players, setPlayers] = useState([]); // A state variable to hold the list of players
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

    return (
        <PageLayout> {/* Wrapping the content with the layout component */}
            <Typography variant="h4" gutterBottom>
                Player List
            </Typography>
            {error && <Typography color="error">{error}</Typography>} {/* Display error message if there's an error */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Base Price</TableCell>
                            <TableCell align="right">Performance Statistics</TableCell>
                            <TableCell align="right">Image URL</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </PageLayout>
    );
};

export default PlayerList;