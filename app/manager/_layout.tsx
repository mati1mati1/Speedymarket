import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { Pressable } from 'react-native';
import InventoryManagementScreen from './inventory';
import OrderManagementScreen from './orders';
import ManagerMapEditor from './map-editor';

const Tab = createBottomTabNavigator();

const iconMap = {
  InventoryManagement: 'cubes',
  OrderManagement: 'clipboard',
  SupermarketMap: 'map',
};

const LogoutButton = () => {
  const { logout } = useUser();

  return (
    <Pressable onPress={logout} />
  );
};

export default function ManagerScreen() {
  return (
    <>
      <Tab.Navigator
        initialRouteName="InventoryManagement"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="InventoryManagement" component={InventoryManagementScreen} />
        <Tab.Screen name="OrderManagement" component={OrderManagementScreen} />
        <Tab.Screen name="SupermarketMap" component={ManagerMapEditor} />
      </Tab.Navigator>
      <LogoutButton />
    </>
  );
}
