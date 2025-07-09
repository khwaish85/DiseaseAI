import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SignUpScreen({ navigation, setIsSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password === confirmPassword && email.length > 0) {
      // In a real app you'd validate more deeply and maybe call an API
      setIsSignedIn(true);
    } else {
      alert('Passwords do not match or email is empty!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#144272' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F1F6F9', textAlign: 'center', marginBottom: 30 },
  input: {
    backgroundColor: '#205295',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: 'white'
  },
  button: {
    backgroundColor: '#2C74B3',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  link: { color: '#A5D7E8', textAlign: 'center', marginTop: 20 },
});
