//admin\frontend\admin-app\src\pages\AuctionPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import PageLayout from '../components/PageLayout';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AuctionPage = () => {
  const [auctionRounds, setAuctionRounds] = useState([]);
  const [newBidAmount, setNewBidAmount] = useState('');
  const [selectedAuctionRound, setSelectedAuctionRound] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctionRounds();

    socket.on('newBid', (updatedAuctionRound) => {
      setAuctionRounds((prevRounds) =>
        prevRounds.map((round) =>
          round._id === updatedAuctionRound._id ? updatedAuctionRound : round
        )
      );
    });

    return () => {
      socket.off('newBid');
    };
  }, []);

  const fetchAuctionRounds = async () => {
    try {
      const response = await api.get('/bidders/auctions');
      setAuctionRounds(response.data);
    } catch (error) {
      console.error('Error fetching auction rounds:', error);
      setError('Error fetching auction rounds');
    }
  };

  const handleBidSubmit = async () => {
    try {
      await api.post('/bidders/place-bid', {
        auctionRoundId: selectedAuctionRound,
        bidAmount: newBidAmount,
      });
      setNewBidAmount('');
      setSelectedAuctionRound(null);
      fetchAuctionRounds();
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Error placing bid');
    }
  };

  return (
    <PageLayout>
      <Typography variant="h4" gutterBottom>
        Auction Rounds
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
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
            {auctionRounds.map((round) => (
              <TableRow key={round._id}>
                <TableCell component="th" scope="row">
                  {new Date(round.startTime).toLocaleString()}
                </TableCell>
                <TableCell align="right">{new Date(round.endTime).toLocaleString()}</TableCell>
                <TableCell align="right">{round.player?.name || 'N/A'}</TableCell>
                <TableCell align="right">{round.currentBid}</TableCell>
                <TableCell align="right">
                  {round.status === 'open' && (
                    <>
                      <TextField
                        label="Bid Amount"
                        type="number"
                        value={newBidAmount}
                        onChange={(e) => setNewBidAmount(e.target.value)}
                        InputProps={{ inputProps: { min: round.currentBid + 1 } }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedAuctionRound(round._id);
                          handleBidSubmit();
                        }}
                      >
                        Place Bid
                      </Button>
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

export default AuctionPage;
