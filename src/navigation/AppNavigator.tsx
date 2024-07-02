import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import InventoryManagementScreen from '../screens/InventoryManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
import ShoppingCartListScreen from '../screens/ShoppingCartListScreen';
import SupermarketMapScreen from '../screens/SupermarketMapScreen';
import AdminMapScreen from '../screens/AdminMapScreen';
import { useUser } from '../context/UserContext';
import { commonStyles } from '../styles/styles';
import Button from '../components/Button';

export type RootStackParamList = {
  BarcodeScanner: undefined;
  ShoppingList: { cartId: string };
  InventoryManagement: undefined;
  OrderManagement: undefined;
  PurchaseHistory: undefined;
  ShoppingCartList: undefined;
  SupermarketMap: undefined;
  AdminMap: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const iconMap: { [key: string]: keyof typeof FontAwesome.glyphMap } = {
  BarcodeScanner: 'barcode',
  ShoppingList: 'shopping-cart',
  InventoryManagement: 'cubes',
  OrderManagement: 'clipboard',
  PurchaseHistory: 'history',
  ShoppingCartList: 'list',
  SupermarketMap: 'map',
  AdminMap: 'edit',
};

const LogoutButton = () => {
  const { logout } = useUser();

  return (
    <Button title="Logout" onPress={logout} color="#dc3545" />
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
            <Tab.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
            <Tab.Screen name="ShoppingCartList" component={ShoppingCartListScreen} />
            <Tab.Screen name="SupermarketMap" component={SupermarketMapScreen} />
          </>
        )}
        {user.role === 'manager' && (
          <>
            <Tab.Screen name="InventoryManagement" component={InventoryManagementScreen} />
            <Tab.Screen name="OrderManagement" component={OrderManagementScreen} />
            <Tab.Screen name="AdminMap" component={AdminMapScreen} />

          </>
        )}
      </Tab.Navigator>
      <LogoutButton />
    </>
  );
}

export { AppNavigator };
