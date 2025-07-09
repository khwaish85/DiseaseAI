import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => navigation.replace('SignIn'), 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logoImage, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.logoText, { opacity: fadeAnim }]}>
        DiseaseAI
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2647',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius:40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F1F6F9',
    letterSpacing: 1.5,
  },
});
