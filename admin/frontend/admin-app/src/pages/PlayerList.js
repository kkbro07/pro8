// PlayerList.js
// admin\frontend\admin-app\src\pages\PlayerList.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import PageLayout from '../components/PageLayout';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
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

  return (
    <PageLayout>
      <Typography variant="h4" gutterBottom>
        Player List
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
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
