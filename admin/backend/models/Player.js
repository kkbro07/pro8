// Player Model (backend/models/Player.js)
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    statistics: { type: String }, // Can be a JSON string or nested object
    // Add more fields like:
    category: { type: String }, // All-rounder, Batsman, Bowler
    team: {type: String, default: null}, // Team the player is in
    imageUrl: {type: String} //URL for the profile pic
});

module.exports = mongoose.model('Player', playerSchema);