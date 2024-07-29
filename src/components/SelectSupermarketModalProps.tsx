import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Pressable } from 'react-native';
import { getSupermarkets } from '../api/api';
import { Supermarket } from '../models';
import styles from '../styles/PopUpWindow';
interface SelectSupermarketModalProps {
  closeModal: (selectedSupermarket: Supermarket | null) => void;
}

const SelectSupermarketModal: React.FC<SelectSupermarketModalProps> = ({ closeModal }) => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchSupermarkets = async (page: number) => {
    setLoading(true);
    console.log('Fetching supermarkets for page:', page);
    try {
      const fetchedSupermarkets = await getSupermarkets();
      console.log('Fetched supermarkets:', fetchedSupermarkets);
      if (fetchedSupermarkets) {
        setSupermarkets((prevLists) => [...prevLists, ...fetchedSupermarkets]);
        console.log('Updated supermarkets state:', supermarkets);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchSupermarkets(page);
      setHasFetched(true);
    }
  }, [hasFetched, page]);

  const handleSelectSupermarket = (supermarket: Supermarket) => {
    setSelectedSupermarket(supermarket);
  };

  const handleConfirmSelection = () => {
    closeModal(selectedSupermarket);
  };

  const handleScanQRCode = () => {
    // Implement QR code scanning functionality
    // After scanning, navigate to CustomerMapViewer with the scanned supermarket data and listId
  };

  return (
    <Modal animationType="slide" transparent={true} onRequestClose={() => closeModal(null)}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Supermarket</Text>
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
            onEndReached={() => setPage((prevPage) => prevPage + 1)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <Text>Loading...</Text> : null}
          />
          <Pressable
            style={[styles.button, !selectedSupermarket && styles.buttonDisabled]}
            onPress={handleConfirmSelection}
            disabled={!selectedSupermarket}
          >
            <Text style={styles.buttonText}>Select Supermarket</Text>
          </Pressable>
          <Pressable onPress={handleScanQRCode}>
            <Text style={styles.scanText}>Scan QR Code</Text>
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