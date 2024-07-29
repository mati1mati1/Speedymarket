import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import SelectListModal from '../../src/components/SelectListModal';
import SelectSupermarketModal from '../../src/components/SelectSupermarketModalProps';

const StartShoppingScreen = () => {
  const [listModalVisible, setListModalVisible] = useState(false);
  const [supermarketModalVisible, setSupermarketModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);

  useEffect(() => {
    setListModalVisible(true); 
  }, []);

  const handleSelectList = () => {
    setListModalVisible(true); // Show the modal with ShoppingCartListScreen
  };

  const handleSelectSupermarket = () => {
    setSupermarketModalVisible(true); // Show the modal with SelectSupermarketScreen
  };

  const handleStartWithoutList = () => {
    setListModalVisible(false);
    setSupermarketModalVisible(true);
  };

  const closeListModal = (selectedList: ShoppingList | null) => {
    setSelectedList(selectedList);
    setListModalVisible(false);
    setSupermarketModalVisible(true);
  };

  const closeSupermarketModal = (selectedSupermarket: Supermarket | null) => {
    setSupermarketModalVisible(false);
    setSelectedSupermarket(selectedSupermarket);
    debugger
    router.push({
      pathname: '/shopping/shoppingMap',
      params: { supermarketId : selectedSupermarket?.SupermarketID, listId : selectedList?.ListID }}
    ); 
    // router.setParams({shopingMap : selectedSupermarket?.SupermarketID, listId : selectedList?.ListID }) 
  };

  const showNewItemDetails = (data: any) => {
    //show the data in the cart u are now using
  };

//exmpale of how to use the scanner  
{/* <ScanItem handleData={showNewItemDetails} supermarketId={"dkjfdfjd"}/> */}

  return (
    <View style={styles.container}>
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
        onRequestClose={() => closeListModal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectListModal closeModal={closeListModal} continueWithoutList={handleStartWithoutList} />
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
            <SelectSupermarketModal closeModal={closeSupermarketModal} />
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