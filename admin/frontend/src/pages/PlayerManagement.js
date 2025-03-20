// admin/frontend/src/pages/PlayerManagement.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PageLayout from '../components/PageLayout';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    basePrice: '',
    statistics: '',
    imageUrl: '',
    team: ''
  });
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editedPlayer, setEditedPlayer] = useState({
    name: '',
    basePrice: '',
    statistics: '',
    imageUrl: '',
    team: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

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
    setNewPlayer({ ...newPlayer, [event.target.name]: event.target.value });
  };

  const handleAddPlayer = async () => {
    try {
      await api.post('/players', newPlayer);
      fetchPlayers();
      setNewPlayer({ name: '', basePrice: '', statistics: '', imageUrl: '', team: '' });
    } catch (error) {
      console.error('Error adding player:', error);
      setError('Error adding player');
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayerId(player._id);
    setEditedPlayer({ ...player });
  };

  const handleEditedInputChange = (event) => {
    setEditedPlayer({ ...editedPlayer, [event.target.name]: event.target.value });
  };

  const handleUpdatePlayer = async () => {
    try {
      await api.put(`/players/${editingPlayerId}`, editedPlayer);
      fetchPlayers();
      setEditingPlayerId(null);
      setEditedPlayer({ name: '', basePrice: '', statistics: '', imageUrl: '', team: '' });
    } catch (error) {
      console.error('Error updating player:', error);
      setError('Error updating player');
    }
  };

  const handleDeletePlayer = async (id) => {
    try {
      await api.delete(`/players/${id}`);
      fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
      setError('Error deleting player');
    }
  };

  return (
    <PageLayout>
      <Typography variant="h4" gutterBottom>
        Player Management
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField label="Name" name="name" value={newPlayer.name} onChange={handleInputChange} />
      <TextField label="Base Price" name="basePrice" value={newPlayer.basePrice} onChange={handleInputChange} />
      <TextField label="Performance Statistics" name="statistics" value={newPlayer.statistics} onChange={handleInputChange} />
      <TextField label="Image URL" name="imageUrl" value={newPlayer.imageUrl} onChange={handleInputChange} />
      <TextField label="Team" name="team" value={newPlayer.team} onChange={handleInputChange} />
      <Button variant="contained" color="primary" onClick={handleAddPlayer}>
        Add Player
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Base Price</TableCell>
              <TableCell align="right">Performance Statistics</TableCell>
              <TableCell align="right">Image URL</TableCell>
              <TableCell align="right">Team</TableCell>
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
                <TableCell align="right">{player.team}</TableCell>
                <TableCell align="right">
                  {editingPlayerId === player._id ? (
                    <>
                      <TextField label="Name" name="name" value={editedPlayer.name} onChange={handleEditedInputChange} />
                      <TextField label="Base Price" name="basePrice" value={editedPlayer.basePrice} onChange={handleEditedInputChange} />
                      <TextField label="Performance Statistics" name="statistics" value={editedPlayer.statistics} onChange={handleEditedInputChange} />
                      <TextField label="Image URL" name="imageUrl" value={editedPlayer.imageUrl} onChange={handleEditedInputChange} />
                      <TextField label="Team" name="team" value={editedPlayer.team} onChange={handleEditedInputChange} />
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