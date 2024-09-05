import React from 'react';
import { router, Stack } from 'expo-router';
import { Pressable, Text } from 'react-native'; // Import the Text component

function ShoppingListLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="supermarketMapsScreean" 
        options={{ headerShown: false , headerTitle: '',title:"Supermarket Maps"}} 
      />
      <Stack.Screen 
        name="shoppingMap" 
        options={{ 
          headerShown: true, 
          headerTitle: 'Shopping Map'
        }} 
      />
    </Stack>
  );
}

export default ShoppingListLayout;
