import React from 'react';
import { useToken } from '../context/TokenContext';
import { useRouter } from 'expo-router';
import { Pressable, Text, StyleSheet } from 'react-native';

const LogoutButton = () => {
  const { logout } = useToken();
  const router = useRouter();

  const handleLogout = () => {
    logout();
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
