import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import SettingsModal from '../../src/components/SettingsModal';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

const iconMap = {
  purchase: 'history',
  shoppingList: 'list',
  shopping: 'shopping-bag',
  supermarketMapsScreean: 'map',
};

export default function CustomerLayout() {
  const [isModalVisible, setModalVisible] = useState(false);

  // Function to open/close the modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name] as keyof typeof FontAwesome.glyphMap;
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          // Add the profile icon in the top right corner
          headerRight: () => (
            <TouchableOpacity onPress={toggleModal} style={{ marginRight: 15 }}>
              <FontAwesome name="user" size={24} color="black" />
            </TouchableOpacity>
          ),
          // Remove the header title text
          headerTitle: "",
        })}
      >
        <Tabs.Screen name="shopping" options={{ headerShown: true }} />
        <Tabs.Screen name="shoppingList" options={{ headerShown: true }} />
        <Tabs.Screen name="purchase" options={{ headerShown: true }} />
      </Tabs>

      {/* User Settings Modal */}
      <SettingsModal visible={isModalVisible} onClose={toggleModal} />
    </>
  );
}
