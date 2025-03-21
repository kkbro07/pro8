const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Bidder = require('../models/Bidder');
const AuctionRound = require('../models/AuctionRound');
const authMiddleware = require('../middleware/authMiddleware');
const { requestOTP, verifyOTP, sendOTPByEmail } = require('../utils/otpUtils'); // Import functions from otpUtils.js

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, teamName } = req.body;
    const bidder = new Bidder({ name, email, password, teamName });
    await bidder.save();
    res.status(201).json({ message: 'Bidder created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating bidder', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const bidder = await Bidder.findOne({ email });
    if (!bidder) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    try {
      const otp = requestOTP(email);
      await sendOTPByEmail(req, email, otp);
      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
      console.error('Error request OTP', error);
      return res.status(429).json({ message: 'Too many OTP requests, try again later' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    verifyOTP(email, otp);
    const bidder = await Bidder.findOne({ email });
    const token = jwt.sign({ bidder: { id: bidder._id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = requestOTP(email);
    await sendOTPByEmail(req, email, otp);
    res.status(200).json({ success: true, message: 'OTP resent to email' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(429).json({ message: 'Error resending OTP: ' + error.message });
  }
});

router.post('/place-bid', authMiddleware, async (req, res) => {
  try {
    const { auctionRoundId, bidAmount } = req.body;
    const auctionRound = await AuctionRound.findById(auctionRoundId);

    if (!auctionRound || auctionRound.status !== 'open') {
      return res.status(400).json({ message: 'Auction round not found or closed' });
    }

    if (bidAmount <= auctionRound.currentBid) {
      return res.status(400).json({ message: 'Bid amount must be higher than current bid' });
    }

    auctionRound.currentBid = bidAmount;
    auctionRound.highestBidder = req.bidder.id;
    auctionRound.bids.push({ userId: req.bidder.id, bidAmount });
    await auctionRound.save();

    res.json(auctionRound);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing bid', error: error.message });
  }
});

router.get('/auctions', authMiddleware, async (req, res) => {
  try {
    const auctionRounds = await AuctionRound.find().populate('player');
    res.json(auctionRounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching auction rounds', error: err.message });
  }
});
module.exports = router;
