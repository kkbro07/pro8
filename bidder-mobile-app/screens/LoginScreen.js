// bidder-mobile-app/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity, // Import TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/bidders/login', { email, password });
      if (response.data.success) {
        setIsOtpSent(true);
      } else {
        setError(response.data.message || 'Login Failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/bidders/verify-otp', { email, otp });
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.token);
        navigation.navigate('Dashboard');
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError(
        'Error verifying OTP: ' + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bidder Login</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {isLoading && <ActivityIndicator size="large" color="#007bff" />}
      {!isOtpSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <Button title="Login" onPress={handleLogin} disabled={isLoading} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            editable={!isLoading}
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} disabled={isLoading} />
        </>
      )}

      {/* New Register Option */}
      <TouchableOpacity onPress={handleNavigateToRegister} style={styles.registerLinkContainer}>
        <Text style={styles.registerLinkText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerLinkContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerLinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;