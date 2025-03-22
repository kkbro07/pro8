// bidder-mobile-app/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import Tab Navigator
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AuctionScreen from '../screens/AuctionScreen'; // Import AuctionScreen
import ProfileScreen from '../screens/ProfileScreen'; // Import ProfileScreen
import { Ionicons } from '@expo/vector-icons'; // Import icons (you'll need to install @expo/vector-icons)

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // Create Tab Navigator

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Auctions') {
            iconName = focused ? 'ios-albums' : 'ios-albums-outline'; // Corrected icon names
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline'; // Corrected icon names
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Auctions" component={AuctionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;