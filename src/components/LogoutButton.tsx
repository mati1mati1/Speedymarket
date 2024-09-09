import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native';

const LogoutButton = () => {
  const { authState, onLogout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/login');
  };

  return (
    <Pressable onPress={handleLogout} style={styles.button}>
      <View style={styles.iconTextContainer}>
        <Icon name="sign-out" size={20} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </View>
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
    width: 120,
    alignSelf: 'flex-end',
    flexDirection: 'row', // Align icon and text horizontally
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5, // Space between icon and text
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


export default LogoutButton;
