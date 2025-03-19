// routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Player = require('../models/Player');

//Get all players (requires authentication)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching players', error: err.message });
    }
});

//Create a new player (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, basePrice, statistics, imageUrl } = req.body;
        const newPlayer = new Player({ name, basePrice, statistics, imageUrl });
        await newPlayer.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating player', error: error.message });
    }
});

//Update a player (requires authentication)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { name, basePrice, statistics, imageUrl } = req.body;
        const updatedPlayer = await Player.findByIdAndUpdate(
            req.params.id,
            { name, basePrice, statistics, imageUrl },
            { new: true }
        );
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(updatedPlayer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating player', error: error.message });
    }
});

//Delete a player (requires authentication)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting player', error: error.message });
    }
});
    // Get the count of players (requires authentication)
router.get('/count', authMiddleware, async (req, res) => {
    try {
        const count = await Player.countDocuments();
        res.json({ count: count });
    } catch (error) {
        console.error('Error fetching player count:', error);
        res.status(500).json({ message: 'Error fetching player count', error: error.message });
    }
});

module.exports = router;