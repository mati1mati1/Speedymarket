import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src//screens/LoginScreen';
import { AppNavigator } from '../src//navigation/AppNavigator';
import { UserProvider, useUser } from '../src//context/UserContext';

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const { user } = useUser();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="AppNavigator" component={AppNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <MainNavigator />
    </UserProvider>
  );
};

export default App;
