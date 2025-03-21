const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bidder',
    required: true
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bid', bidSchema);
