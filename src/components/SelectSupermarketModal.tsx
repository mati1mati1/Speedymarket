import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getSupermarketByBarcode, getSupermarkets } from 'src/api/api';
import { Supermarket } from 'src/models';
import ScanItem from './Scanner';
import { useAuth } from 'src/context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';

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

  const handleSelectSupermarket = (supermarket: Supermarket) => {
    setSelectedSupermarket(supermarket);
  };

  const handleScannedBarcode = async (data: string) => {
    try {
      let response = await getSupermarketByBarcode(data);
      if (response.length > 0) {
        setSelectedSupermarket(response[0]);
        setScannedDataModalOpen(false);
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
          <View style={styles.header}>
            <Text style={styles.title}>Select Supermarket</Text>
            <Pressable onPress={() => closeModal(null)}>
              <Icon name="close" size={24} color="red" />
            </Pressable>
          </View>
          <Text style={styles.instructionText}>
            Please choose a supermarket from the dropdown or scan a QR code.
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.dropdownContainer}>
              <RNPickerSelect
                onValueChange={(value) => handleSelectSupermarket(value)}
                items={supermarkets.map((item) => ({
                  label: item.BranchName,
                  value: item,
                }))}
                style={pickerSelectStyles}
                value={selectedSupermarket}
                placeholder={{ label: "Select a supermarket", value: null }}
              />
              <Pressable
                style={[styles.button, !selectedSupermarket && styles.buttonDisabled]}
                onPress={handleConfirmSelection}
                disabled={!selectedSupermarket}
              >
                <Text style={styles.buttonText}>Select</Text>
              </Pressable>
            </View>
          )}
          <Modal visible={isScannedDataOpen} transparent={true} onRequestClose={toggleIsScannedDataOpen}>
            <TouchableOpacity style={styles.modalContainer} onPress={toggleIsScannedDataOpen}>
              <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                <ScanItem handleData={handleScannedBarcode} />
              </View>
            </TouchableOpacity>
          </Modal>
          <Pressable style={[styles.button, {alignSelf: 'flex-start'}]} onPress={toggleIsScannedDataOpen}>
            <Text style={styles.buttonText}>Scan QR Code</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 20,
    // marginBottom: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    height: 25,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    marginVertical: 15,
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    height: 50,
    flex: 1,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    height: 50,
    flex: 1,
  },
});

export default SelectSupermarketModal;
