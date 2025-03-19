const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const Admin = require('../models/Admin');

// In-memory storage for OTPs (for demonstration purposes)
const otpStore = new Map();

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // OTP is valid, proceed with login
  const token = jwt.sign({ admin: { id: admin._id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token });
});

module.exports = router;
