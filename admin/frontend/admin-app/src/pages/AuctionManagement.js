//admin\frontend\admin-app\src\pages\AuctionManagement.js
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import api from '../utils/api';

const AuctionManagement = () => {
  const [auctionRounds, setAuctionRounds] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchAuctionData();
  }, []);

  const fetchAuctionData = async () => {
    try {
      const [auctionsRes, bidsRes] = await Promise.all([
        api.get('/auctions'),
        api.get('/auctions/bids')
      ]);
      setAuctionRounds(auctionsRes.data);
      setBids(bidsRes.data);
    } catch (error) {
      console.error('Error fetching auction data:', error);
    }
  };

  const handleApproveBid = async (bidId) => {
    try {
      await api.post(`/auctions/approve-bid/${bidId}`);
      fetchAuctionData();
    } catch (error) {
      console.error('Error approving bid:', error);
    }
  };

  return (
    <PageLayout>
      <Typography variant="h4" gutterBottom>
        Auction Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Bidder</TableCell>
              <TableCell>Bid Amount</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid._id}>
                <TableCell>{bid.player.name}</TableCell>
                <TableCell>{bid.bidder.teamName}</TableCell>
                <TableCell>₹{bid.amount} Cr</TableCell>
                <TableCell>{new Date(bid.timestamp).toLocaleString()}</TableCell>
                <TableCell>{bid.status || 'Pending'}</TableCell>
                <TableCell>
                  {bid.status !== 'Approved' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApproveBid(bid._id)}
                    >
                      Approve Bid
                    </Button>
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

export default AuctionManagement;
