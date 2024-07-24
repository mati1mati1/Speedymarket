import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { TokenProvider } from '../src/context/TokenContext';

export {
  ErrorBoundary,
} from 'expo-router';

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TokenProvider> {/* Replace UserProvider with TokenProvider */}
      <RootLayoutNav />
    </TokenProvider>
  );
}

function RootLayoutNav() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false,  headerTitleAlign: 'center'}} />
        <Stack.Screen name="(manager)" options={{ headerShown: false , headerTitleAlign: 'center'}} />
        <Stack.Screen name="(customer)/shoppingList" options={{ headerShown: false , headerTitleAlign: 'center'}} />
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="error" options={{ presentation: 'modal', headerShown: false , headerTitleAlign: 'center'}} />
        <Stack.Screen name="register" options={{ headerShown: false , headerTitleAlign: 'center'}} />
        <Stack.Screen name="index" options={{ headerShown: false ,
          headerTitle: 'SpeedyMarket',
        }} />
      </Stack>
    </DndProvider>
  );
}
