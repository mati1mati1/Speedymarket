// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import { useUser } from '../context/UserContext';

const Tab = createBottomTabNavigator();

const iconMap: { [key: string]: keyof typeof FontAwesome.glyphMap } = {
  BarcodeScanner: 'barcode',
  ShoppingList: 'shopping-cart',
  InventoryManagement: 'cubes',
  OrderManagement: 'clipboard',
};

const LogoutButton = () => {
  const { logout } = useUser();

  return (
    <View style={styles.logoutButton}>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

function AppNavigator() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <Tab.Navigator
        initialRouteName="BarcodeScanner"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        {user.role === 'customer' && (
          <>
            <Tab.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
            <Tab.Screen name="ShoppingList" component={ShoppingListScreen} />
          </>
        )}
        {user.role === 'manager' && (
          <>
            <Tab.Screen name="InventoryManagement" component={InventoryManagementScreen} />
            <Tab.Screen name="OrderManagement" component={OrderManagementScreen} />
          </>
        )}
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
  },
});

export { AppNavigator };
