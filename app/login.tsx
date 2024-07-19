import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../src/api/auth';
import { useUser } from '../src/context/UserContext';
import Button from '../src/components/Button';
import Input from '../src/components/Input';

export default function LoginScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'manager') {
        router.replace('/manager');
      } else {
        router.replace('/customer');
      }
    }
  }, [user]);

  const handleLogin = async () => {
    console.log("handleLogin called");
    try {
      if (username === "achinoam") {
        setUser({ username: "achinoam", role: "manager" });
        router.replace('/manager');
      } else {
        const data = await login(username, password);
        if (data.success) {
          setUser(data.user);
          router.replace('/customer');
        } else {
          alert('Login failed');
        }
      }
    } catch (error) {
      console.error('An error occurred during login', error);
      alert('An error occurred during login');
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
        <Pressable onPress={handleLogin}>
          <Text>Login</Text>
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
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
