import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal } from 'react-native';
import ShoppingCartListScreen from './ShoppingCartListScreen';

const StartShoppingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectList = () => {
    setModalVisible(true); // Show the modal with ShoppingCartListScreen
  };

  const handleStartWithoutList = () => {
    // Navigate to the supermarket selection screen or any other screen as required
    // Note: Update this navigation logic to fit your routing structure
    //navigation.navigate('SupermarketMap', { listId: '' });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Shopping</Text>
      <Button title="Select List" onPress={handleSelectList} />
      <Button title="Start Without List" onPress={handleStartWithoutList} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ShoppingCartListScreen closeModal={closeModal} />
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
    marginVertical: 10,
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
