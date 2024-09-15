import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import InventoryManagementScreen from './inventory';
import OrderManagementScreen from './orders';
import LogoutButton from '../../src/components/LogoutButton';
import ManagerSettingsScreen from './ManagerSettingsScreen';
import ManagerMapEditor from './mapEditor';
import { Header } from 'react-native-elements';

const Tab = createBottomTabNavigator();

const iconMap = {
  "Inventory Management": 'cubes',
  OrderManagement: 'clipboard',
  SupermarketMap: 'map',
  Settings: 'cog',
};


export default function ManagerScreen() {
  return (
    <>
      <LogoutButton />
      <Tab.Navigator
        initialRouteName="Inventory Management"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Inventory Management" component={InventoryManagementScreen} options={{headerShown: false}} />
        <Tab.Screen name="OrderManagement" component={OrderManagementScreen} options={{headerShown: false}} />
        {Platform.OS === 'web' ?
        <Tab.Screen name="SupermarketMap" component={ManagerMapEditor}  options={{headerShown: false}}/>
        : null}
        <Tab.Screen name="Settings" component={ManagerSettingsScreen} options={{headerShown: false}} />
      </Tab.Navigator>
    </>
  );
}