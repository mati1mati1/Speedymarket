import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getSupermarketByBarcode, getSupermarkets } from 'src/api/api';
import { Supermarket } from 'src/models';
import ScanMobileItem from './ScannerMobile';
import { useAuth } from 'src/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import customAlert from './AlertComponent';

interface SelectSupermarketModalProps {
  closeModal: (selectedSupermarket: Supermarket | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const SelectSupermarketModal: React.FC<SelectSupermarketModalProps> = ({ closeModal, setIsLoading, isLoading }) => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isScannedDataOpen, setScannedDataModalOpen] = useState(false);
  const { authState } = useAuth();
  const token = authState.token;

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

  const handleScannedBarcode = async (data: string) => {
    try {
      const response = await getSupermarketByBarcode(data);
      if (response.length > 0) {
        setSelectedSupermarket(response[0]);
        setScannedDataModalOpen(false);
      } else {
        customAlert('Supermarket not found', 'Please try again');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleIsScannedDataOpen = () => {
    setScannedDataModalOpen(!isScannedDataOpen);
  };

  const handleConfirmSelection = () => {
    closeModal(selectedSupermarket);
  };

  return (
    <Modal animationType="slide" transparent={true} onRequestClose={() => closeModal(null)}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => closeModal(null)}>
            <FontAwesome name="times" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Select A Supermarket</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={selectedSupermarket?.SupermarketID}
              onValueChange={(itemValue) => {
                const supermarket = supermarkets.find((s) => s.SupermarketID === itemValue);
                setSelectedSupermarket(supermarket || null); // Set selectedSupermarket correctly
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a supermarket..." value={null} />
              {supermarkets.map((supermarket) => (
                <Picker.Item
                  key={supermarket.SupermarketID}
                  label={supermarket.BranchName}
                  value={supermarket.SupermarketID}
                />
              ))}
            </Picker>
          )}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, !selectedSupermarket && styles.buttonDisabled]}
              onPress={handleConfirmSelection}
              disabled={!selectedSupermarket}
            >
              <Text style={styles.buttonText}>Select Supermarket</Text>
            </Pressable>
            <Text>OR</Text>
            <Pressable style={styles.button} onPress={toggleIsScannedDataOpen}>
              <Text style={styles.buttonText}>Scan</Text>
            </Pressable>
          </View>
          <Modal visible={isScannedDataOpen} transparent={true} onRequestClose={toggleIsScannedDataOpen}>
            <TouchableOpacity style={styles.modalContainer} onPress={toggleIsScannedDataOpen}>
              <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                <ScanMobileItem handleData={handleScannedBarcode} closeMe={toggleIsScannedDataOpen}/>
              </View>
            </TouchableOpacity>
          </Modal>
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
    alignSelf: 'flex-start',
  },
  picker: {
    width: '100%',
    height: 20,
    marginBottom: 150, // Add margin to separate from buttons
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5, // Adjust spacing between buttons
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '10%'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
});

export default SelectSupermarketModal;