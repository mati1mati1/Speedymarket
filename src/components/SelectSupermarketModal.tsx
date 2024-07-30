import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { getSupermarkets } from 'src/api/api';
import { Supermarket } from 'src/models';

interface SelectSupermarketModalProps {
  closeModal: (selectedSupermarket: Supermarket | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const SelectSupermarketModal: React.FC<SelectSupermarketModalProps> = ({ closeModal, setIsLoading, isLoading }) => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchSupermarkets = async () => {
    setIsLoading(true);
    try {
      const fetchedSupermarkets = await getSupermarkets();
      if (fetchedSupermarkets) {
        setSupermarkets(fetchedSupermarkets);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchSupermarkets();
      setHasFetched(true);
    }
  }, [hasFetched]);

  const handleSelectSupermarket = (supermarket: Supermarket) => {
    setSelectedSupermarket(supermarket);
  };

  const handleConfirmSelection = () => {
    closeModal(selectedSupermarket);
  };

  return (
    <Modal animationType="slide" transparent={true} onRequestClose={() => closeModal(null)}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Supermarket</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={supermarkets}
              keyExtractor={(item) => item.SupermarketID.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.listItem, selectedSupermarket?.SupermarketID === item.SupermarketID && styles.selectedItem]}
                  onPress={() => handleSelectSupermarket(item)}
                >
                  <Text style={styles.listItemText}>
                    {item.BranchName}
                  </Text>
                </Pressable>
              )}
            />
          )}
          <Pressable
            style={[styles.button, !selectedSupermarket && styles.buttonDisabled]}
            onPress={handleConfirmSelection}
            disabled={!selectedSupermarket}
          >
            <Text style={styles.buttonText}>Select Supermarket</Text>
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

export default SelectSupermarketModal;
