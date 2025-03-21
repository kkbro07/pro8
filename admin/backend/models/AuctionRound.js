// admin/backend/models/AuctionRound.js
const mongoose = require('mongoose');

const auctionRoundSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  status: { type: String, enum: ['open', 'closed', 'pending'], default: 'pending' },
  bids: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bidder',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  winningBid: {
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bidder'
    },
    amount: Number,
    timestamp: Date
  }
});

module.exports = mongoose.model('AuctionRound', auctionRoundSchema);