import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../src/components/Input';
import { useAuth } from '../src/context/AuthContext';
import { Role } from '../src/models';

export default function LoginScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { onLogin } = useAuth();
  const { width } = useWindowDimensions(); // Get the window width

  const handleLogin = async () => {
    console.log("handleLogin called with:", username, password); // Debugging
    try {
      const response = await onLogin!(username, password);
      if (response.success) {
        if (response.role === Role.Seller) {
            router.replace('/(manager)/inventory');
          }
        else if (response.role === Role.Buyer) {
          router.replace('/(customer)/shopping/supermarketMapsScreen');
        }
        else{
          Alert.alert('Login failed', 'Unknown role');
        }
      }
       else {
        Alert.alert('Login failed', 'Please check your username and password.');
      }
    } catch (error) {
      console.error('An error occurred during login', error);
      Alert.alert('An error occurred during login', error.message);
    }
  };

  const isWeb = Platform.OS === 'web' && width > 600; // Check if the platform is web and width is greater than 600

  return (
    <View style={styles.container}>
      {isWeb ? (
        <View style={styles.webLayout}>
          <View style={styles.formContainer}>
            <View style={styles.loginForm}>
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
            <Pressable onPress={() => router.replace('/register')} style={styles.link}>
              <Text style={styles.link}>Register</Text>
            </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.image} />
          </View>
        </View>
      ) : (
        <View style={styles.mobileLayout}>
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
            <Pressable onPress={() => router.replace('/register')} style={styles.link}>
              <Text style={styles.link}>Register</Text>
            </Pressable>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.image} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  webLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '50%',
    marginBottom: 20,
  },
  loginForm: {
    padding: 30,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    height: '60%',
  },
  link: {
    marginTop: 10,
    color: "#007bff",
    alignItems: 'center',
    fontSize: 16,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
