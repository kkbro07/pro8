// auctionRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const AuctionRound = require('../models/AuctionRound');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const auctionRounds = await AuctionRound.find().populate('player');
        res.json(auctionRounds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching auction rounds', error: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { startTime, endTime, player } = req.body;
        const newAuctionRound = new AuctionRound({ startTime, endTime, player });
        await newAuctionRound.save();
        res.status(201).json(newAuctionRound);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating auction round', error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { startTime, endTime, player, currentBid, highestBidder, status } = req.body;
        const updatedAuctionRound = await AuctionRound.findByIdAndUpdate(
            req.params.id,
            { startTime, endTime, player, currentBid, highestBidder, status },
            { new: true }
        );
        if (!updatedAuctionRound) {
            return res.status(404).json({ message: 'Auction Round not found' });
        }
        res.json(updatedAuctionRound);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating auction round', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const auctionRound = await AuctionRound.findByIdAndDelete(req.params.id);
        if (!auctionRound) {
            return res.status(404).json({ message: 'Auction Round not found' });
        }
        res.json({ message: 'Auction Round deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting Auction Round', error: error.message });
    }
});

router.post('/bid', authMiddleware, async (req, res) => {
    try {
        const { auctionRoundId, bidAmount, bidderId } = req.body;

        const auctionRound = await AuctionRound.findById(auctionRoundId);

        if (!auctionRound || auctionRound.status !== 'open') {
            return res.status(400).json({ message: 'Auction round not found or closed' });
        }

        if (bidAmount <= auctionRound.currentBid) {
            return res.status(400).json({ message: 'Bid amount must be higher than current bid' });
        }

        auctionRound.currentBid = bidAmount;
        auctionRound.highestBidder = bidderId; // bidderId should be passed from the frontend
        auctionRound.bids.push({ bidder: bidderId, amount: bidAmount, timestamp: new Date() });
        await auctionRound.save();

        // Populate the 'player' field to get player details
        await auctionRound.populate('player');
        res.json(auctionRound);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
});

module.exports = router;