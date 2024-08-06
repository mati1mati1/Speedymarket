import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useToken } from '../../src/context/TokenContext';
import { Pressable, Text, StyleSheet } from 'react-native';
import InventoryManagementScreen from './inventory';
import OrderManagementScreen from './orders';
import ManagerMapEditor from './map-editor';
import { Tabs } from 'expo-router';
import LogoutButton from '../../src/components/LogoutButton';

const iconMap = {
  InventoryManagement: 'cubes',
  OrderManagement: 'clipboard',
  SupermarketMap: 'map',
};


export default function ManagerScreen() {
  return (
    <>
      <Tabs
        initialRouteName="Inventory Management"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="Inventory Management"/>
        <Tabs.Screen name="OrderManagement" />
        <Tabs.Screen name="SupermarketMap" />
      </Tabs>
      <LogoutButton />
    </>
  );
}



