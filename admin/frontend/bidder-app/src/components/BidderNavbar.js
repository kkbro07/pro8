import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const BidderNavbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('admin');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Bidder Cricket Auction
                </Typography>
                <Box>
                    {isLoggedIn ? (
                        <>
                            <Button color="inherit" component={Link} to="/bidder-dashboard">
                                Dashboard
                            </Button>
                            <Button color="inherit" component={Link} to="/auction-page">
                                Auctions
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/bidder-login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/bidder-register">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default BidderNavbar;