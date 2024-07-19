import React from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

const LogoutButton = () => {
  const { logout } = useUser();
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
