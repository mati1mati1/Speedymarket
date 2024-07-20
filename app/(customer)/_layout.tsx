import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import purchaseHistoryScreen from './purchaseHistory';
import shoppingCartListScreen from './shoppingCartList';
import startShoppingScreen from './startShopping';
import LogoutButton from '../../src/components/LogoutButton';
const Tab = createBottomTabNavigator();

const iconMap = {
  PurchaseHistory: 'history',
  ShoppingCartList: 'list',
  StartShopping: 'shopping-bag',
};


export default function CustomerLayout() {
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
        <Tab.Screen name="PurchaseHistory" component={purchaseHistoryScreen} />
        <Tab.Screen name="ShoppingCartList" component={shoppingCartListScreen} />
        <Tab.Screen name="StartShopping" component={startShoppingScreen} />
      </Tab.Navigator>
      <LogoutButton />
    </>
  );
}
