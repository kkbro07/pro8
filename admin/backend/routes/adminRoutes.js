// admin/backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const juice = require('juice');
const geoip = require('geoip-lite');
const useragent = require('useragent');
const crypto = require('crypto');

const otpStore = new Map();
const otpRequestCounts = new Map();

const OTP_EXPIRATION_TIME = 10 * 60 * 1000;
const MAX_OTP_REQUESTS = 10;
const RESEND_OTP_COOLDOWN = 2 * 60 * 1000;

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOTPByEmail = async (req, email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const now = new Date();
  const dateTime = now.toLocaleString();
  const ip = req?.headers?.['x-forwarded-for']?.split(',')[0] || req?.socket?.remoteAddress || 'Unknown IP';
  const geo = geoip.lookup(ip);
  const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown Location';
  const userAgentString = req?.headers?.['user-agent'] || 'Unknown Device';
  const agent = useragent.parse(userAgentString);
  const device = `${agent.family} ${agent.major}.${agent.minor}.${agent.patch} on ${agent.os.family} ${agent.os.major}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification - Cricket Tournament Admin</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; color: #333; }
        .container { max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .header { background-color: #0056b3; color: white; padding: 24px; text-align: center; font-size: 28px; }
        .content { padding: 40px; font-size: 16px; line-height: 1.6; }
        .otp { font-size: 36px; font-weight: bold; color: #0056b3; margin: 30px 0; text-align: center; }
        .warning { color: #cc0000; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; padding: 20px; background-color: #f0f4f8; }
        .details { margin-top: 40px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
        a { color: #0056b3; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Cricket Tournament Admin - OTP Verification</div>
        <div class="content">
          <p>Dear Admin,</p>
          <p>Your One-Time Password (OTP) to access the Cricket Tournament Admin Panel is:</p>
          <p class="otp">${otp}</p>
          <p class="warning">Do not share this OTP with anyone. It is valid for 10 minutes only.</p>
          <div class="details">
            <p><strong>We noticed a login attempt from a new device or location:</strong></p>
            <p>Device: ${device}</p>
            <p>Location: ${location}</p>
            <p>Date & Time: ${dateTime}</p>
          </div>
          <p>If this wasn't you, please secure your account immediately.</p>
          <p>Thank you,<br>Cricket Tournament Support Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>Need help? <a href="mailto:support@crickettournament.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const inlinedHtml = juice(htmlContent);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Cricket Tournament Admin - OTP Verification',
    html: inlinedHtml,
    text: `Dear Admin,\n\nYour OTP (One-Time Password) for logging into the Cricket Tournament Admin Panel is: ${otp}\n\nPlease do not share this OTP with anyone. It is valid for 10 minutes only.\n\nWe noticed a login attempt from:\nDevice: ${device}\nLocation: ${location}\nDate & Time: ${dateTime}\n\nIf this wasn't you, please secure your account immediately.\n\nSincerely,\nCricket Tournament Support Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully.');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

const requestOTP = (email) => {
  const currentTime = Date.now();
  const requestCount = otpRequestCounts.get(email) || { count: 0, firstRequestTime: currentTime, lastRequestTime: 0 };

  if (currentTime - requestCount.firstRequestTime > OTP_EXPIRATION_TIME) {
    otpRequestCounts.set(email, { count: 1, firstRequestTime: currentTime, lastRequestTime: currentTime });
  } else {
    if (currentTime - requestCount.lastRequestTime < RESEND_OTP_COOLDOWN) {
      const timeLeft = Math.ceil((RESEND_OTP_COOLDOWN - (currentTime - requestCount.lastRequestTime)) / 1000);
      throw new Error(`Please wait ${timeLeft} seconds before requesting another OTP.`);
    }
    requestCount.count += 1;
    requestCount.lastRequestTime = currentTime;
    otpRequestCounts.set(email, requestCount);
  }

  if (requestCount.count > MAX_OTP_REQUESTS) {
    throw new Error('Too many OTP requests. Please try again later.');
  }

  const otp = generateOTP();
  otpStore.set(email, { otp, expires: Date.now() + OTP_EXPIRATION_TIME });

  return otp;
};

const verifyOTP = (email, otp) => {
  const storedData = otpStore.get(email);
  if (!storedData || storedData.otp !== otp || Date.now() > storedData.expires) {
    throw new Error('Invalid or expired OTP');
  }
  otpStore.delete(email);
  return true;
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = new Admin({ name, email, password });
    await admin.save();
    const token = jwt.sign({ admin: { id: admin._id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Admin created', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating admin', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    try {
      const otp = requestOTP(email);
      await sendOTPByEmail(req, email, otp);
      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
      console.error('Error request OTP', error);
      return res.status(429).json({ message: 'Too many OTP request, try again later' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.get('/admins', authMiddleware, async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
});

router.delete('/admins/:id', authMiddleware, async (req, res) => {
  try {
    const adminId = req.params.id;
    const adminToDelete = await Admin.findById(adminId);
    if (!adminToDelete) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    if (adminToDelete.email === '21bmiit110@gmail.com') {
      return res.status(400).json({ message: 'Cannot delete the master admin' });
    }
    await Admin.findByIdAndDelete(adminId);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
});

router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.json({ count: count });
  } catch (error) {
    console.error("Error fetching admin count:", error);
    res.status(500).json({ message: "Error fetching admin count", error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    verifyOTP(email, otp);
    const admin = await Admin.findOne({ email });
    const token = jwt.sign({ admin: { id: admin._id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
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

module.exports = router;
