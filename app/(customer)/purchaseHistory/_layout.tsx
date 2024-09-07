import React from 'react';
import { Stack, Tabs } from 'expo-router';

export default function ShoppingListLayout() {
  return (
    <Stack>
      <Stack.Screen name="purchaseHistory" options={{ headerShown: false }}/>
      <Stack.Screen name="[purchaseId]" options={{ headerShown: false }}/>
    </Stack>
    
  );
}
