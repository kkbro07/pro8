import React from 'react';
import { Container, Box } from '@mui/material';  // Make sure Box is imported
import Footer from './Footer';

const PageLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure the layout takes up the full viewport height
      }}
    >
      <Container sx={{ py: 3, flexGrow: 1 }}>{children}</Container> {/* py for padding-y */}
      <Footer />
    </Box>
  );
};

export default PageLayout;