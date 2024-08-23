import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LogoutButton = () => {
  const { authState, onLogout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/login');
  };

  return (
    <Pressable onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogoutButton;
