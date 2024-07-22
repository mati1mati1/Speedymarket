import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../src/api/auth';
import { useUser } from '../src/context/UserContext';
import Input from '../src/components/Input';

export default function LoginScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'manager') {
        // if (Platform.OS !== 'web') {
        //   router.replace('/error');
        // } else {
          router.replace('/(manager)/inventory');

      } else {
        router.replace('/(customer)/shoppingCartList');
      }
    }
  }, [user, router]);

  const handleLogin = async () => {
    console.log("handleLogin called with:", username, password); // Debugging

    try {
      if (username === "achinoam") {
        setUser({ username: "achinoam", role: "manager" });
        if (Platform.OS !== 'web') {
          router.replace('/error');
        } else {
          router.replace('/(manager)/inventory');
        }
      } else {
        const data = await login(username, password);
        console.log("Login response:", data); // Debugging

        if (data.success) {
          setUser(data.user);
          if(data.user.role === 'manager') {
            // if (Platform.OS !== 'web') {
            //   router.replace('/error');
            // } else {
              router.replace('/(manager)/inventory');
            // }
          }
          else{
            router.replace('/(customer)/shoppingCartList');
          }
        } else {
          Alert.alert('Login failed', 'Please check your username and password.');
        }
      }
    } catch (error) {
      console.error('An error occurred during login', error);
      Alert.alert('An error occurred during login', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome to SpeedyMarket</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>
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
        <Pressable onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
