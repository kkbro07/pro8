//admin\frontend\src\components\Footer.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: 'center',
        bgcolor: 'lightgray',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 Cricket Auction. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;