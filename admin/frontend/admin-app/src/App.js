// admin/frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Home from './pages/Home';
import Login from './pages/AdminLogin';
import Dashboard from './pages/AdminDashboard';
import PlayerManagement from './pages/PlayerManagement';
import AuctionScheduling from './pages/AuctionScheduling';
import PlayerList from './pages/PlayerList';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/players" element={isLoggedIn ? <PlayerManagement /> : <Navigate to="/login" />} />
        <Route path="/playerList" element={<PlayerList />} />
        <Route path="/auctions" element={isLoggedIn ? <AuctionScheduling /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;