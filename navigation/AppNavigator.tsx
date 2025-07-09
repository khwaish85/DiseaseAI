// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet } from 'react-native';

import DoctorScreen from '../screens/DoctorScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => {
            let icon;
            if (route.name === 'Home') {
              icon = focused
                ? require('../assets/home_active.png')
                : require('../assets/home_inactive.png');
            } else if (route.name === 'Doctors') {
              icon = focused
                ? require('../assets/doctor_active.png')
                : require('../assets/doctor_inactive.png');
            } else if (route.name === 'Profile') {
              icon = focused
                ? require('../assets/profile_active.png')
                : require('../assets/profile_inactive.png');
            }
            return <Image source={icon} style={styles.icon} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Doctors" component={DoctorScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#EAF6FF',
    height: 75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 10,
    
  },
  tabLabel: {
    marginTop:5,
    color: '#0A2647',
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 4,
    marginLeft:2,
  },
  icon: {
    marginTop:9,
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  icon1: {
    marginTop:9,
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginLeft:4,
  },
});
