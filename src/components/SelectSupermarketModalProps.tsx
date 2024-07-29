import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { getSupermarkets } from 'src/api/api';
import { Supermarket } from 'src/models';
import styles from 'src/styles/PopUpWindow';

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
                  style={styles.listItem}
                  onPress={() => handleSelectSupermarket(item)}
                >
                  <Text style={selectedSupermarket?.SupermarketID === item.SupermarketID ? styles.selectedItem : styles.listItemText}>
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

export default SelectSupermarketModal;
