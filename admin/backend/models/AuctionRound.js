// admin/backend/models/AuctionRound.js
const mongoose = require('mongoose');

const auctionRoundSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  status: { type: String, enum: ['open', 'closed', 'pending'], default: 'pending' },
  bids: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      bidAmount: { type: Number },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('AuctionRound', auctionRoundSchema);