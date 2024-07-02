import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import BarcodeScannerScreen from '../src/screens/BarcodeScannerScreen';
import ShoppingListScreen from '../src/screens/ShoppingListScreen';
import InventoryManagementScreen from '../src/screens/InventoryManagementScreen';
import OrderManagementScreen from '../src/screens/OrderManagementScreen';

const Tab = createBottomTabNavigator();

const iconMap: { [key: string]: keyof typeof FontAwesome.glyphMap } = {
  BarcodeScanner: 'barcode',
  ShoppingList: 'shopping-cart',
  InventoryManagement: 'cubes',
  OrderManagement: 'clipboard',
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="BarcodeScanner"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
        <Tab.Screen name="ShoppingList" component={ShoppingListScreen} />
        <Tab.Screen name="InventoryManagement" component={InventoryManagementScreen} />
        <Tab.Screen name="OrderManagement" component={OrderManagementScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
