const nodemailer = require('nodemailer');
const juice = require('juice');
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

  const htmlContent = `
    <p>Your OTP for logging into the Cricket Tournament Bidding Platform is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  `;

  const inlinedHtml = juice(htmlContent);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Cricket Tournament Bidder - OTP Verification',
    html: inlinedHtml,
    text: `Your OTP for logging into the Cricket Tournament Bidding Platform is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
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
  console.log(`Generated OTP for ${email}: ${otp}`); // Debug log
  otpStore.set(email, { otp, expires: Date.now() + OTP_EXPIRATION_TIME });

  return otp;
};

const verifyOTP = (email, otp) => {
  const storedData = otpStore.get(email);
  console.log(`Verifying OTP for ${email}: Stored OTP: ${storedData?.otp}, Provided OTP: ${otp}`); // Debug log
  if (!storedData || storedData.otp !== otp || Date.now() > storedData.expires) {
    throw new Error('Invalid or expired OTP');
  }
  otpStore.delete(email);
  return true;
};

module.exports = {
  requestOTP,
  verifyOTP,
  sendOTPByEmail,
};
