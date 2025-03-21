// bidder-mobile-app/components/AuctionList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import api from '../utils/api';

const AuctionList = ({ auctionRounds, onBidSubmit }) => {
  const renderItem = ({ item }) => (
    <View style={styles.auctionRound}>
      <Text>Player: {item.player?.name || 'N/A'}</Text>
      <Text>Current Bid: {item.currentBid}</Text>
      {item.status === 'open' && (
        <BidForm auctionRoundId={item._id} onBidSubmit={onBidSubmit} currentBid={item.currentBid} />
      )}
    </View>
  );

  return (
    <FlatList
      data={auctionRounds}
      renderItem={renderItem}
      keyExtractor={item => item._id}
    />
  );
};

const BidForm = ({ auctionRoundId, onBidSubmit, currentBid }) => {
  const [bidAmount, setBidAmount] = React.useState('');

  const handleSubmit = () => {
    onBidSubmit(auctionRoundId, bidAmount);
    setBidAmount('');
  };

  return (
    <View style={styles.bidForm}>
      <TextInput
        style={styles.bidInput}
        placeholder={`Enter bid (min ${currentBid + 1})`}
        value={bidAmount}
        onChangeText={setBidAmount}
        keyboardType="number-pad"
      />
      <Button title="Place Bid" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  auctionRound: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  bidForm: {
    marginTop: 5,
  },
  bidInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 5,
    borderRadius: 3,
  },
});

export default AuctionList;