import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';  // Importing FontAwesome for the "X" icon
import { updateUserInfo } from '../api/api';  // Assuming the path to api/api
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import customAlert from './AlertComponent';  // Assuming the path to customAlert

const SettingsModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setlastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { authState, onLogout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    onClose();
    onLogout();
    router.push('/login');
  };

  const handleSave = async () => {
    if (!name || !email || !lastName || !phoneNumber) {
      customAlert('Error', 'Please fill in all fields');
      return;
    }
    try {
      // Call updateUserInfo API function to update user details
      const response = await updateUserInfo(name, email, lastName, phoneNumber);
      customAlert('Success', 'User details updated successfully');
    } catch (error) {
      customAlert('Error', 'Failed to update user details');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.modalText}>Update User Settings</Text>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setlastName}
            // secureTextEntry={true}
          />
          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Phone Number Input */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.textStyle}>Save</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
});

export default SettingsModal;
