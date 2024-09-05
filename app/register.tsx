import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../src/components/Input';

export default function RegisterScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('customer'); // Default role as 'customer'
  const router = useRouter();

  const handleRegister = async () => {

    try {
      // Here, you would typically call an API to register the user
      // For this example, we'll assume the registration is always successful
      Alert.alert('Registration successful', 'You can now log in with your credentials.');
      router.replace('/login');
    } catch (error) {
      console.error('An error occurred during registration', error);
      Alert.alert('An error occurred during registration', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Register for SpeedyMarket</Text>
        <Text style={styles.subtitle}>Please enter your details to register</Text>
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
        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
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
