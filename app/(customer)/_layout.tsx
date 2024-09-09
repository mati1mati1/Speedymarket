import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import LogoutButton from '../../src/components/LogoutButton';
import { Platform } from 'react-native';

const iconMap = {
  purchaseHistory: 'history',
  shoppingList: 'list',
  shopping: 'shopping-bag',
  supermarketMapsScreean: 'map',
};

export default function CustomerLayout() {
  return (
    <>    
    <LogoutButton />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="shopping" options={{title:"Start Shopping" ,headerShown: false}} />
        <Tabs.Screen name="shoppingList" options={{title:"Shopping List" ,headerShown: false}}/>
        <Tabs.Screen name="purchaseHistory" options={{title:"Purchase History" ,headerShown: false}}/>
      </Tabs>
    </>
  );
}

