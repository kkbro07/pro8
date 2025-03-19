const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const AuctionRound = require('../models/AuctionRound'); //Import the AuctionRound model

// Get all auction rounds (requires authentication)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const auctionRounds = await AuctionRound.find().populate('player'); //Populate the player field to get player details
        res.json(auctionRounds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching auction rounds', error: err.message });
    }
});

//Create a new auction round (requires authentication)
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

//Update an auction round (requires authentication)
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

//Delete an auction round (requires authentication)
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

module.exports = router;