import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../src/components/Input';
import { useAuth } from '../src/context/AuthContext';
import { Role } from '../src/models';
import { ImageBackground } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { onLogin } = useAuth();
  const { width } = useWindowDimensions(); // Get the window width
  const isWeb = Platform.OS === 'web' && width > 600; // Check if the platform is web and width is greater than 600

  const handleLogin = async () => {
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
          if (isWeb) {
            Toast.show({
              type: 'error',
              text1: 'Login failed',
              text2: 'Unknown role',
            });
          } else {
            Alert.alert('Login failed', 'Unknown role');
          }
        }
      }
       else {
        if (isWeb) {
          Toast.show({
            type: 'error',
            text1: 'Login failed',
            text2: 'Please check your username and password.',
          });
        } else {
          Alert.alert('Login failed', 'Please check your username and password.');
        }
      }
    } catch (error) {
      console.error('An error occurred during login', error);
      if (isWeb) {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: error.message,
        });
      } else {
        Alert.alert('An error occurred during login', error.message);
      }
    }
  };


  return (
    <View style={styles.container}>
      {isWeb ? (
        <View style={styles.webLayout}>
          <View style={styles.formContainer}>
            <Toast/>
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
              <Text style={styles.link}>Don't have an account yet? Register here</Text>
            </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.image} />
          </View>
        </View>
      ) : (
        <ImageBackground source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.mobileLayout}>
        <View style={styles.mobileLayout}>
          <View style={styles.mobileLayoutForm}>
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
              <Text style={styles.link}>Don't have an account yet? Register here</Text>
            </Pressable>
          </View>
        </View>
        </ImageBackground>
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
  mobileLayoutForm: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 30,
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
    marginTop: '20%',
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
