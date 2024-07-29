import React from 'react';
import { router, Stack } from 'expo-router';
import { Pressable, Text } from 'react-native'; // Import the Text component

function ShoppingListLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="selectSupermarketAndList" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Shopping Map" 
        options={{ 
          headerShown: true, 
          headerTitle: 'Shopping Map'
        }} 
      />
    </Stack>
  );
}

export default ShoppingListLayout;