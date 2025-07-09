import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import PredictForm from '../screens/PredictForm';
import ResultScreen from '../screens/ResultScreen';
import DoctorScreen from '../screens/DoctorScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
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
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Home') {
            icon = focused
              ? require('../assets/home_active.png')
              : require('../assets/home_inactive.png');
          } else if (route.name === 'Appointment') {
            icon = focused
              ? require('../assets/doctor_active.png')
              : require('../assets/doctor_inactive.png');
          } else if (route.name === 'Profile') {
            icon = focused
              ? require('../assets/profile_active.png')
              : require('../assets/profile_inactive.png');
          }
          return <Image source={icon} style={{ width: 26, height: 26, marginTop: 9 }} />;
        },
        tabBarLabel: ({ focused }) => {
          const labelMap = {
            Home: 'Home',
            Appointment: 'Appointment',
            Profile: 'Profile',
          };
          return (
            <Text
              style={{
                color: focused ? '#686DFE' : '#0A2647',
                fontSize: 12,
                fontWeight: '600',
                paddingBottom: 4,
                marginLeft: 2,
                marginTop: 5,
              }}
            >
              {labelMap[route.name]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointment" component={DoctorScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function HomeStack() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // simulate loading
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {loading ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : !isSignedIn ? (
        <>
          <Stack.Screen name="SignIn">
            {(props) => <SignInScreen {...props} setIsSignedIn={setIsSignedIn} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {(props) => <SignUpScreen {...props} setIsSignedIn={setIsSignedIn} />}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="PredictForm" component={PredictForm} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
