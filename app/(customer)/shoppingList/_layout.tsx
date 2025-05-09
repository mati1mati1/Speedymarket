import React from 'react';
import { Stack, Tabs } from 'expo-router';

export default function ShoppingListLayout() {
  return (
    <Stack>
      <Stack.Screen name="shoppingCartList" options={{ headerShown: false }}/>
      <Stack.Screen name="[listId]" options={{ headerShown: false }}/>
    </Stack>
    
  );
}
