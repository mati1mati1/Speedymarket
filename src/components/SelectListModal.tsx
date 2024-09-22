import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getShoppingListsByBuyerId } from 'src/api/api';
import { useAuth } from 'src/context/AuthContext';
import { ShoppingList } from 'src/models';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

interface SelectListModalProps {
  closeModal: (selectedList: ShoppingList | null) => void;
  continueWithoutList: () => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const SelectListModal: React.FC<SelectListModalProps> = ({ closeModal, continueWithoutList, setIsLoading, isLoading }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const { authState } = useAuth();
  const token = authState.token;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedShoppingLists = await getShoppingListsByBuyerId();
      if (fetchedShoppingLists) {
        setShoppingLists(fetchedShoppingLists);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmSelection = () => {
    closeModal(selectedList);
  };

  return (
    <Modal animationType="slide" transparent={true} onRequestClose={() => closeModal(null)}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => closeModal(null)}>
            <FontAwesome name="times" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Select a Shopping List</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={selectedList?.ListID}
              onValueChange={(itemValue) => {
                const list = shoppingLists.find((shoppingList) => shoppingList.ListID === itemValue);
                setSelectedList(list || null);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a list..." value={null} />
              {shoppingLists.map((list) => (
                <Picker.Item key={list.ListID} label={list.ListName} value={list.ListID} />
              ))}
            </Picker>
          )}
          <Pressable
            style={[styles.button, !selectedList && styles.buttonDisabled]}
            onPress={handleConfirmSelection}
            disabled={!selectedList}
          >
            <Text style={styles.buttonText}>Confirm Selection</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.continueButton]} onPress={continueWithoutList}>
            <Text style={styles.buttonText}>Continue Without List</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  picker: {
    width: '100%',
    height: 30,
    marginBottom: 120,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButton: {
    backgroundColor: '#0000ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
});

export default SelectListModal;
