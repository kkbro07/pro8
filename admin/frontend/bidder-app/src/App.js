import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import BidderDashboard from './pages/BidderDashboard';
import BidderRegister from './pages/BidderRegister';
import BidderLogin from './pages/BidderLogin';
import AuctionPage from './pages/AuctionPage';
import Home from './pages/Home';
import BidderNavbar from './components/BidderNavbar'; // Import BidderNavbar

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <Router>
            <BidderNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bidder-register" element={<BidderRegister />} />
                <Route path="/bidder-login" element={!isLoggedIn ? <BidderLogin setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/bidder-dashboard" />} />
                <Route path="/bidder-dashboard" element={isLoggedIn ? <BidderDashboard /> : <Navigate to="/bidder-login" />} />
                <Route path="/auction-page" element={isLoggedIn ? <AuctionPage /> : <Navigate to="/bidder-login" />} />
            </Routes>
        </Router>
    );
}

export default App;