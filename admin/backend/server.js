// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const playerRoutes = require('./routes/playerRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidderRoutes = require('./routes/bidderRoutes');
const socketIo = require('socket.io');
const http = require('http');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

app.use(limiter);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bidders', bidderRoutes);

// Socket.IO setup
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('placeBid', async (bidData) => {
        try {
            const { auctionRoundId, bidAmount, bidderId } = bidData;
            const auctionRound = await AuctionRound.findById(auctionRoundId);

            if (!auctionRound || auctionRound.status !== 'open') {
                console.log("Auction is not active.");
                return;
            }

            if (bidAmount <= auctionRound.currentBid) {
                console.log("Bid amount is too low.");
                return;
            }

            auctionRound.currentBid = bidAmount;
            auctionRound.highestBidder = bidderId;
            await auctionRound.save();

            // Emit to all connected clients
            io.emit('newBid', {
                auctionRoundId,
                bidAmount,
                bidderId,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error handling bid:', error);
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});