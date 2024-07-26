import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Pressable } from 'react-native';
import { getSupermarkets } from '../api/api';
import { Supermarket } from '../models';


interface SelectSupermarketModalProps {
  visible: boolean;
  closeModal: () => void;
}

const SelectSupermarketModal: React.FC<SelectSupermarketModalProps> = ({ visible, closeModal }) => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);

  useEffect(() => {
    const fetchSupermarkets = async () => {
      const data = await getSupermarkets();
      setSupermarkets(data);
    };

    fetchSupermarkets();
  }, []);

  const handleSelectSupermarket = (supermarket: Supermarket) => {
    setSelectedSupermarket(supermarket);
  };

  const handleConfirmSelection = () => {
    if (selectedSupermarket) {
      closeModal(); 
    }
  };

  const handleScanQRCode = () => {
    // Implement QR code scanning functionality
    // After scanning, navigate to CustomerMapViewer with the scanned supermarket data and listId
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Supermarket</Text>
          <FlatList
            data={supermarkets}
            keyExtractor={(item) => item.SupermarketID}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => handleSelectSupermarket(item)}
              >
                <Text style={selectedSupermarket?.SupermarketID === item.SupermarketID ? styles.selectedItem : styles.itemText}>
                  {item.BranchName}
                </Text>
              </Pressable>
            )}
          />
          <Pressable
            style={styles.button}
            onPress={handleConfirmSelection}
            disabled={!selectedSupermarket}
          >
            <Text style={styles.buttonText}>Select Supermarket</Text>
          </Pressable>
          <Pressable onPress={handleScanQRCode}>
            <Text>Scan QR Code</Text>
          </Pressable>
          <Pressable onPress={closeModal}>
            <Text>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 18,
  },
  selectedItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  button: {
    // Add your button styles here
  },
  buttonText: {
    // Add your button text styles here
  },
});

export default SelectSupermarketModal;
