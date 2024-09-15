import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { Role } from '../src/models';

export const unstable_settings = {
  initialRouteName: 'login',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

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
  const { authState } = useAuth();
  useEffect(() => {
    if(!authState?.authenticated){ {
      router.replace('/login');
    }
  }}, []);
  return (
    <DndProvider backend={HTML5Backend}>
      <Stack screenOptions={{headerShown: false}}>
        {authState?.authenticated && authState.role === Role.Seller ? (
        <Stack.Screen name="(manager)" options={{ headerShown: false, headerTitleAlign: 'center' }} />
      ) : authState?.authenticated && authState.role === Role.Buyer ? (
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
      ) : authState?.authenticated && authState.role === Role.Supplier ? (
        <Stack.Screen name="(supplier)" options={{ headerShown: false }} />
      )
      :
        (
        <><Stack.Screen name="index" options={{ headerShown: false}} />
        <Stack.Screen name="register" options={{ headerShown: false}} />
        <Stack.Screen name="login" options={{ headerShown: false}} />
        </>
        )}
      </Stack>
    </DndProvider>
  );
}
