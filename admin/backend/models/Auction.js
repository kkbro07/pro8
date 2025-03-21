const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  currentBid: {
    type: Number,
    default: 0
  },
  currentBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bidder'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  },
  startTime: Date,
  endTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Auction', auctionSchema);
