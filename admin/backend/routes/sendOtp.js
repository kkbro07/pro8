const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// In-memory storage for OTPs (for demonstration purposes)
const otpStore = new Map();

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  // Store OTP in memory with expiration
  otpStore.set(email, otp);
  setTimeout(() => otpStore.delete(email), 10 * 60 * 1000); // 10 minutes expiration

  // Send OTP via email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
    res.json({ message: 'OTP sent successfully' });
  });
});

module.exports = router;
