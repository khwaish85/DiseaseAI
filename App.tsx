import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './navigation/HomeStack'; // Adjust path as needed

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
