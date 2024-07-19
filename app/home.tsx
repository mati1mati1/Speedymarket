import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import PurchaseHistoryScreen from './customer/purchaseHistoryScreen';
import ShoppingCartListScreen from './customer/shoppingCartListScreen';
import StartShoppingScreen from './customer/startShoppingScreen';
import { useUser } from '../src/context/UserContext';
import Button from '../src/components/Button';
import { Pressable } from 'react-native';

const Tab = createBottomTabNavigator();

const iconMap = {
  PurchaseHistory: 'history',
  ShoppingCartList: 'list',
  StartShopping: 'shopping-bag',
};

const LogoutButton = () => {
  const { logout } = useUser();

  return (
    <Pressable onPress={logout} />
  );
};

export default function CustomerScreen() {
  return (
    <>
      <Tab.Navigator
        initialRouteName="StartShopping"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
        <Tab.Screen name="ShoppingCartList" component={ShoppingCartListScreen} />
        <Tab.Screen name="StartShopping" component={StartShoppingScreen} />
      </Tab.Navigator>
      <LogoutButton />
    </>
  );
}
