import React from 'react';
import LogoutButton from '../../src/components/LogoutButton';
import { Stack } from 'expo-router';


export default function SupplierScreen() {
  return (
    <>
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="orders" options={{ headerShown: false }}/>
        </Stack>
      <LogoutButton />
    </>
  );
}