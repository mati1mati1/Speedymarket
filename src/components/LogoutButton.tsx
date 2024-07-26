import React from 'react';
import { useToken } from '../context/TokenContext';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

const LogoutButton = () => {
  const { logout } = useToken();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Pressable onPress={handleLogout}>
        <Text>Logout</Text>
    </Pressable>
  );
};

export default LogoutButton;
