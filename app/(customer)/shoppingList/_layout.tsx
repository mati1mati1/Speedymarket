import React from 'react';
import { Stack } from 'expo-router';

export default function ShoppingListLayout() {
  return (
    <Stack>
      <Stack.Screen name="shoppingCartList"/>
      <Stack.Screen name="[edit-list]"/>
    </Stack>
  );
}
