import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function ErrorScreen() {
  const { authState, onLogout } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access Denied</Text>
      <Text style={styles.message}>Managers cannot log in from mobile devices.</Text>
      <Link replace href="/login" onPress={() => onLogout()}>Return to login page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});
