// bidder-mobile-app/screens/AuctionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import AuctionList from '../components/AuctionList';

const AuctionScreen = ({ navigation }) => {
  const [auctionRounds, setAuctionRounds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctionRounds();
  }, []);

  const fetchAuctionRounds = async () => {
    try {
      const response = await api.get('/bidders/auctions');
      setAuctionRounds(response.data);
    } catch (error) {
      setError('Failed to fetch auction rounds');
    }
  };

  const handleBidSubmit = async (auctionRoundId, bidAmount) => {
    try {
      await api.post('/bidders/place-bid', { auctionRoundId, bidAmount });
      fetchAuctionRounds(); // Refresh the auction rounds
    } catch (err) {
      setError('Failed to place bid');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auction List</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <AuctionList auctionRounds={auctionRounds} onBidSubmit={handleBidSubmit} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AuctionScreen;