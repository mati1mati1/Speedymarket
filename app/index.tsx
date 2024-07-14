// app/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import InventoryManagementScreen from './screens/InventoryManagementScreen';
import ManagerMapEditor from './screens/ManagerMapEditor';
import { AppNavigator } from './AppNavigator';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="InventoryManagement" component={InventoryManagementScreen} />
        <Stack.Screen name="ManagerMapEditor" component={ManagerMapEditor} />
        <Stack.Screen name="Main" component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
