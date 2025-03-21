// Home.js
// admin/frontend/src/pages/Home.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import PageLayout from '../components/PageLayout';

// Styled Components with Enhanced Premium Design
const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  color: '#222',
}));




const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  backgroundColor: '#0047ab',
  color: '#fff',
}));

const Home = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Premium Cricket Auctions Platform
          </Typography>
          <Typography variant="h5" paragraph>
            Seamlessly manage cricket player auctions with our powerful, easy-to-use system.
          </Typography>
          <Box mt={5}>
            <StyledButton variant="contained">Get Started</StyledButton>
            <Button
              variant="outlined"
              sx={{ ml: 3, color: '#0047ab', borderColor: '#0047ab', borderRadius: '8px', padding: '12px 36px', fontSize: '1rem' }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </HeroSection>
    </PageLayout>
  );
};

export default Home;