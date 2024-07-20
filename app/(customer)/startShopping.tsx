import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import SelectListModal from '../../src/components/SelectListModal';
import SelectSupermarketModal from '../../src/components/SelectSupermarketModalProps';

const StartShoppingScreen = () => {
  const [listModalVisible, setListModalVisible] = useState(false);
  const [supermarketModalVisible, setSupermarketModalVisible] = useState(false);

  const handleSelectList = () => {
    setListModalVisible(true); // Show the modal with ShoppingCartListScreen
  };

  const handleSelectSupermarket = () => {
    setSupermarketModalVisible(true); // Show the modal with SelectSupermarketScreen
  };

  const handleStartWithoutList = () => {
    // Navigate to the supermarket selection screen or any other screen as required
    // Note: Update this navigation logic to fit your routing structure
    //navigation.navigate('SupermarketMap', { listId: '' });
  };

  const closeListModal = () => {
    setListModalVisible(false);
  };

  const closeSupermarketModal = () => {
    setSupermarketModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Shopping</Text>
      <Pressable style={styles.button} onPress={handleSelectList}>
        <Text style={styles.buttonText}>Select List</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleSelectSupermarket}>
        <Text style={styles.buttonText}>Select Supermarket</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleStartWithoutList}>
        <Text style={styles.buttonText}>Start Without List</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={listModalVisible}
        onRequestClose={closeListModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectListModal closeModal={closeListModal} visible={false} />
            <Pressable style={styles.closeButton} onPress={closeListModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={supermarketModalVisible}
        onRequestClose={closeSupermarketModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectSupermarketModal closeModal={closeSupermarketModal} visible={false} />
            <Pressable style={styles.closeButton} onPress={closeSupermarketModal}>
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
