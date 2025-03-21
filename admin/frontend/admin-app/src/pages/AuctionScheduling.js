import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PageLayout from '../components/PageLayout';

const AuctionScheduling = () => {
    const [auctionRounds, setAuctionRounds] = useState([]);
    const [newAuctionRound, setNewAuctionRound] = useState({
        startTime: '',
        endTime: '',
        player: '',
    });
    const [editingAuctionRoundId, setEditingAuctionRoundId] = useState(null);
    const [editedAuctionRound, setEditedAuctionRound] = useState({
        startTime: '',
        endTime: '',
        player: '',
    });
    const [error, setError] = useState('');
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchAuctionRounds();
        fetchPlayers();
    }, []);

    const fetchAuctionRounds = async () => {
        try {
            const response = await api.get('/auctions');
            setAuctionRounds(response.data);
        } catch (error) {
            console.error('Error fetching auction rounds:', error);
            setError('Error fetching auction rounds');
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await api.get('/players');
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players:', error);
            setError('Error fetching players');
        }
    };

    const handleInputChange = (event) => {
        setNewAuctionRound({ ...newAuctionRound, [event.target.name]: event.target.value });
    };

    const handleAddAuctionRound = async () => {
        try {
            await api.post('/auctions', newAuctionRound);
            fetchAuctionRounds();
            setNewAuctionRound({ startTime: '', endTime: '', player: '' });
        } catch (error) {
            console.error('Error adding auction round:', error);
            setError('Error adding auction round');
        }
    };

    const handleEditAuctionRound = (auctionRound) => {
        setEditingAuctionRoundId(auctionRound._id);
        setEditedAuctionRound({ ...auctionRound });
    };

    const handleEditedInputChange = (event) => {
        setEditedAuctionRound({ ...editedAuctionRound, [event.target.name]: event.target.value });
    };

    const handleUpdateAuctionRound = async () => {
        try {
            await api.put(`/auctions/${editingAuctionRoundId}`, editedAuctionRound);
            fetchAuctionRounds();
            setEditingAuctionRoundId(null);
            setEditedAuctionRound({ startTime: '', endTime: '', player: '' });
        } catch (error) {
            console.error('Error updating auction round:', error);
            setError('Error updating auction round');
        }
    };

    const handleDeleteAuctionRound = async (id) => {
        try {
            await api.delete(`/auctions/${id}`);
            fetchAuctionRounds();
        } catch (error) {
            console.error('Error deleting auction round:', error);
            setError('Error deleting auction round');
        }
    };

    return (
        <PageLayout>
            <h2>Auction Scheduling</h2>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                label="Start Time"
                type="datetime-local"
                name="startTime"
                value={newAuctionRound.startTime}
                onChange={handleInputChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="End Time"
                type="datetime-local"
                name="endTime"
                value={newAuctionRound.endTime}
                onChange={handleInputChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                select
                label="Player"
                name="player"
                value={newAuctionRound.player}
                onChange={handleInputChange}
                SelectProps={{
                    native: true,
                }}
            >
                <option aria-label="None" value="" />
                {players.map((player) => (
                    <option key={player._id} value={player._id}>
                        {player.name}
                    </option>
                ))}
            </TextField>
            <Button variant="contained" color="primary" onClick={handleAddAuctionRound}>
                Add Auction Round
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Start Time</TableCell>
                            <TableCell align="right">End Time</TableCell>
                            <TableCell align="right">Player</TableCell>
                            <TableCell align="right">Current Bid</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {auctionRounds.map((auctionRound) => (
                            <TableRow
                                key={auctionRound._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {new Date(auctionRound.startTime).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">{new Date(auctionRound.endTime).toLocaleString()}</TableCell>
                                <TableCell align="right">{auctionRound.player?.name || 'N/A'}</TableCell>
                                <TableCell align="right">{auctionRound.currentBid}</TableCell>
                                <TableCell align="right">
                                    {editingAuctionRoundId === auctionRound._id ? (
                                        <>
                                            <TextField
                                                label="Start Time"
                                                type="datetime-local"
                                                name="startTime"
                                                value={editedAuctionRound.startTime}
                                                onChange={handleEditedInputChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <TextField
                                                label="End Time"
                                                type="datetime-local"
                                                name="endTime"
                                                value={editedAuctionRound.endTime}
                                                onChange={handleEditedInputChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <TextField
                                                select
                                                label="Player"
                                                name="player"
                                                value={editedAuctionRound.player}
                                                onChange={handleEditedInputChange}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                            >
                                                <option aria-label="None" value="" />
                                                {players.map((player) => (
                                                    <option key={player._id} value={player._id}>
                                                        {player.name}
                                                    </option>
                                                ))}
                                            </TextField>
                                            <Button variant="contained" color="primary" onClick={handleUpdateAuctionRound}>Update</Button>
                                            <Button onClick={() => setEditingAuctionRoundId(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton aria-label="edit" onClick={() => handleEditAuctionRound(auctionRound)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => handleDeleteAuctionRound(auctionRound._id)}>
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

export default AuctionScheduling;