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

const Tab = createBottomTabNavigator();

const iconMap = {
  InventoryManagement: 'cubes',
  OrderManagement: 'clipboard',
  SupermarketMap: 'map',
};


export default function ManagerScreen() {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Inventory Management"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Inventory Management" component={InventoryManagementScreen} />
        <Tab.Screen name="OrderManagement" component={OrderManagementScreen} />
        <Tab.Screen name="SupermarketMap" component={ManagerMapEditor} />
      </Tab.Navigator>
      <LogoutButton />
    </>
  );
}



