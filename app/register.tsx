import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, Platform, useWindowDimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../src/components/Input';
import { registerUser } from '../src/api/api';
import Toast from 'react-native-toast-message';
import customAlert from '../src/components/AlertComponent';

export default function RegisterScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const router = useRouter();
  const { width } = useWindowDimensions(); // Get the window width

  const handleRegister = async () => {
    try {
      if (!username || !password || !name || !lastName || !email || !phone) {
        Alert.alert('Missing fields', 'Please fill in all fields.');
        Toast.show({
          type: 'error',
          text1: 'Missing fields',
          text2: 'Please fill in all fields.',
        });
        return;
      }
      await registerUser(name, lastName, username, password, email, phone);
      Alert.alert('Registration successful', 'You can now log in with your credentials.');
      Toast.show({
        type: 'success',
        text1: 'Registration successful',
        text2: 'You can now log in with your credentials.',
      });
      //put a timer:
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    } catch (error) {
      console.error('An error occurred during registration', error);
      customAlert('An error occurred during registration', error.message);
    }
  };

  const isWeb = Platform.OS === 'web' && width > 600; 

  return (
    <View style={styles.container}>
      {isWeb ? (
        <View style={styles.webLayout}>
          <View style={styles.formContainer}>
            <View style={styles.loginForm}>
              <Toast/>
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
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Name"
              />
              <Input
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
              />
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
              />
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
              />
              <Pressable onPress={handleRegister} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </Pressable>
              <Pressable onPress={() => router.replace('/login')} style={styles.link}>
                <Text style={styles.link}>Already have an account? Login here</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.image} />
          </View>
        </View>
      ) : (
        <ImageBackground source={{ uri: "https://i.ibb.co/bzJcXC8/super-Market.png" }} style={styles.mobileLayout}>
          <View style={styles.mobileLayoutForm}>
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
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <Input
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
            />
            <Pressable onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            <Pressable onPress={() => router.replace('/login')} style={styles.link}>
              <Text style={styles.link}>Already have an account? Login here</Text>
            </Pressable>
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
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: Platform.OS === 'web' ? 0 : 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
