import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ErrorBoundary from '../src/components/Error';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { Role } from '../src/models';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
  );
}



function RootLayoutNav() {
  const {authState, onLogin, onLogout} = useAuth();

  return (
    <DndProvider backend={HTML5Backend}>
      <Stack>
        {authState?.authenticated && authState.role === Role.Seller ? (
        <Stack.Screen name="(manager)" options={{ headerShown: false, headerTitleAlign: 'center' }} />
      ) : authState?.authenticated && authState.role === Role.Buyer ? (
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
      ):
        (
        <><Stack.Screen name="index" options={{ headerShown: false, headerTitle: 'SpeedyMarket' }} />
        <Stack.Screen name="register" options={{ headerShown: false, headerTitleAlign: 'center' }} />
        <Stack.Screen name="login" options={{ headerShown: false, headerTitleAlign: 'center' }} />
        </>
        )}
      </Stack>
    </DndProvider>
  );
}

