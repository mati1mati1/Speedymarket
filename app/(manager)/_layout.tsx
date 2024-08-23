import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Slot, Tabs } from 'expo-router';
import LogoutButton from '../../src/components/LogoutButton';
import ManagerSettingsScreen from './ManagerSettingsScreen';


const iconMap = {
  inventory: 'cubes',
  orders: 'clipboard',
  mapEditor: 'map',
};


export default function ManagerScreen() {
  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="inventory"/>
        <Tabs.Screen name="orders"/>
        <Tabs.Screen name="mapEditor" />
      </Tabs>
      <LogoutButton />
    </>
  );
}



