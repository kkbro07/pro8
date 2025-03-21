import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { People, Group, Event, AttachMoney } from '@mui/icons-material';
import PageLayout from '../components/PageLayout';
import api from '../utils/api';

const BidderDashboard = () => {
  const [auctionRounds, setAuctionRounds] = useState([]);
  const [newBidAmount, setNewBidAmount] = useState('');
  const [selectedAuctionRound, setSelectedAuctionRound] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctionRounds();
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
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Auction Rounds
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <List>
              {auctionRounds.map((round) => (
                <ListItem key={round._id} divider>
                  <ListItemText
                    primary={`Auction Round ${round._id}`}
                    secondary={`Current Bid: ${round.currentBid}`}
                  />
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
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </PageLayout>
  );
};

export default BidderDashboard;
