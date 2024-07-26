import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useToken } from '../../src/context/TokenContext';
import { Pressable, Text, StyleSheet } from 'react-native';
import InventoryManagementScreen from './inventory';
import OrderManagementScreen from './orders';
import ManagerMapEditor from './map-editor';
import { Tabs } from 'expo-router';

const Tab = createBottomTabNavigator();

const iconMap = {
  InventoryManagement: 'cubes',
  OrderManagement: 'clipboard',
  SupermarketMap: 'map',
};

const LogoutButton = () => {
  const { logout } = useToken();

  return (
    <Pressable onPress={logout} style={styles.logoutButton}>
      <Text style={styles.logoutButtonText}>Logout</Text>
    </Pressable>
  );
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

const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});


