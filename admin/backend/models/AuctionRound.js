// AuctionRound Model (backend/models/AuctionRound.js)
const mongoose = require('mongoose');

const auctionRoundSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    currentBid: { type: Number, default: 0 },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to the User model
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true}, //The player up for auction
    status: {type: String, enum: ['open', 'closed', 'pending'], default: 'pending'}  //Auction round Status
});

module.exports = mongoose.model('AuctionRound', auctionRoundSchema);