// admin/backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const playerRoutes = require('./routes/playerRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const socketIo = require('socket.io');
const http = require('http');
const rateLimit = require('express-rate-limit'); // Import rate limit package

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server using express app
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter); // Apply rate limiting to all requests

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/auctions', auctionRoutes);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust according to your frontend domain
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
