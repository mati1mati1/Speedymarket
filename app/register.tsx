import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, Platform, useWindowDimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../src/components/Input';
import { Picker } from '@react-native-picker/picker';
import customAlert from '../src/components/AlertComponent';


export default function RegisterScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('customer'); // Default role as 'customer'
  const router = useRouter();
  const { width } = useWindowDimensions(); // Get the window width

  const handleRegister = async () => {
    try {

      customAlert('Registration successful', 'You can now log in with your credentials.');
      router.replace('/login');
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
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Role:</Text>
                  <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Customer" value="customer" />
                    <Picker.Item label="Seller" value="seller" />
                    <Picker.Item label="Supplier" value="supplier" />
                  </Picker>
              </View>
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
              value={role}
              onChangeText={setRole}
              placeholder="Role"
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
