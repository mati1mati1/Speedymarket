import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { getShoppingListsByBuyerId } from 'src/api/api';
import { useAuth } from 'src/context/AuthContext';
import { ShoppingList } from 'src/models'; // Ensure this is correctly imported

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

  const handleSelectList = (list: ShoppingList) => {
    setSelectedList(list);
  };

  const handleConfirmSelection = () => {
    closeModal(selectedList);
  };

  return (
    <Modal animationType="slide" transparent={true} onRequestClose={() => closeModal(null)}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select a Shopping List</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={shoppingLists}
              keyExtractor={(item) => item.ListID}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.listItem, selectedList?.ListID === item.ListID && styles.selectedItem]}
                  onPress={() => handleSelectList(item)}
                >
                  <Text style={styles.listItemText}>
                    {item.ListName}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={<Text>No Shopping Lists Available</Text>}
            />
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
          <Pressable onPress={() => closeModal(null)}>
            <Text style={styles.closeText}>Close</Text>
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
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  listItemText: {
    fontSize: 18,
    color: 'black',
  },
  selectedItem: {
    backgroundColor: '#dcdcdc',
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
  closeText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
});

export default SelectListModal;
