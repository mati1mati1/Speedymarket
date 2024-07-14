import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { login } from '../../src/api/auth';
import { useUser } from '../../src/context/UserContext';
import { commonStyles } from '../../src/styles/styles';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import { getUserById } from '../../src/api/api';
interface LoginScreenProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser } = useUser();

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      debugger
      if (data.success) {
        setUser(data.user);
        const userId = "fc34dc92-f3ec-419b-91b8-10d409432cca"; // Replace with an actual user ID from your database
        const result = await getUserById(userId);
        navigation.navigate('AppNavigator');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Welcome to MySupermarket</Text>
      <Text style={commonStyles.subtitle}>Please login to continue</Text>
      <Input
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

export default LoginScreen;
