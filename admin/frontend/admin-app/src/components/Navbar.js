import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
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
                    Admin Cricket Auction
                </Typography>
                <Box>
                    {isLoggedIn ? (
                        <>
                            <Button color="inherit" component={Link} to="/dashboard">
                                Dashboard
                            </Button>
                            <Button color="inherit" component={Link} to="/players">
                                Players
                            </Button>
                            <Button color="inherit" component={Link} to="/auctions">
                                Auctions
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;