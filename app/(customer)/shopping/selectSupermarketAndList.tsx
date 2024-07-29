import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import SelectListModal from 'src/components/SelectListModal';
import SelectSupermarketModal from 'src/components/SelectSupermarketModalProps';
import { ShoppingList, Supermarket } from 'src/models';

const StartShoppingScreen = () => {
  const [listModalVisible, setListModalVisible] = useState(false);
  const [supermarketModalVisible, setSupermarketModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSupermarketLoading, setIsSupermarketLoading] = useState(false);

  const handleSelectList = () => {
    setListModalVisible(true);
  };

  const handleSelectSupermarket = () => {
    setSupermarketModalVisible(true);
  };
  const handleStartWithoutList = () => {
    setSelectedList(null);
  };

  const startShopping = () => {
    if (selectedSupermarket != null) {
      router.push({
        pathname: '/shopping/shoppingMap',
        params: { supermarketId: selectedSupermarket?.SupermarketID, listId: selectedList?.ListID }
      });
  }
  };

  const closeListModal = (selectedList: ShoppingList | null) => {
    setSelectedList(selectedList);
    setListModalVisible(false);
  };

  const closeSupermarketModal = (selectedSupermarket: Supermarket | null) => {
    setSupermarketModalVisible(false);
    if (selectedSupermarket != null) {
      setSelectedSupermarket(selectedSupermarket);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleSelectList}>
        <Text style={styles.buttonText}>Select List</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleSelectSupermarket}>
        <Text style={styles.buttonText}>Select Supermarket</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={startShopping}>
        <Text style={styles.buttonText}>Start shopping</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={listModalVisible}
        onRequestClose={() => closeListModal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectListModal
              closeModal={closeListModal}
              continueWithoutList={handleStartWithoutList}
              setIsLoading={setIsListLoading}
              isLoading={isListLoading}
            />
            <Pressable style={styles.closeButton} onPress={() => closeListModal(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={supermarketModalVisible}
        onRequestClose={() => closeSupermarketModal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectSupermarketModal
              closeModal={closeSupermarketModal}
              setIsLoading={setIsSupermarketLoading}
              isLoading={isSupermarketLoading}
            />
            <Pressable style={styles.closeButton} onPress={() => closeSupermarketModal(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
  },
  modalContainer: {
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
  },
});

export default StartShoppingScreen;