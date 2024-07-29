import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { getShoppingListsByBuyerId } from 'src/api/api';
import { ShoppingList } from 'src/models'; // Ensure this is correctly imported
import useAuth from 'src/hooks/useAuth'; // Ensure this is correctly imported
import styles from 'src/styles/PopUpWindow'; // Ensure this is correctly imported

interface SelectListModalProps {
  closeModal: (selectedList: ShoppingList | null) => void;
  continueWithoutList: () => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const SelectListModal: React.FC<SelectListModalProps> = ({ closeModal, continueWithoutList, setIsLoading, isLoading }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const token = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedShoppingLists = await getShoppingListsByBuyerId(token);
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
  }, [token]);

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
                  style={styles.listItem}
                  onPress={() => handleSelectList(item)}
                >
                  <Text style={selectedList?.ListID === item.ListID ? styles.selectedItem : styles.listItemText}>
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
          <Pressable style={styles.button} onPress={continueWithoutList}>
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

export default SelectListModal;
