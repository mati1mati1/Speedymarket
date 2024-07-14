import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getSupermarkets } from '../api/api';
import { Seller } from '../models';

type SelectSupermarketScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectSupermarket'>;
type SelectSupermarketScreenRouteProp = RouteProp<RootStackParamList, 'SelectSupermarket'>;

const SelectSupermarketScreen = () => {
  const navigation = useNavigation<SelectSupermarketScreenNavigationProp>();
  const route = useRoute<SelectSupermarketScreenRouteProp>();
  const { listId } = route.params;
  const [supermarkets, setSupermarkets] = useState<Seller[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Seller | null>(null);

  useEffect(() => {
    const fetchSupermarkets = async () => {
      const data = await getSupermarkets();
      setSupermarkets(data);
    };

    fetchSupermarkets();
  }, []);

  const handleSelectSupermarket = (supermarket: Seller) => {
    setSelectedSupermarket(supermarket);
  };

  const handleConfirmSelection = () => {
    if (selectedSupermarket) {
      // Navigate to CustomerMapViewer with the selected supermarket and listId
      navigation.navigate('CustomerMapViewer', { supermarketId: selectedSupermarket.SellerID, listId });
    }
  };

  const handleScanQRCode = () => {
    // Implement QR code scanning functionality
    // After scanning, navigate to CustomerMapViewer with the scanned supermarket data and listId
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Supermarket</Text>
      <FlatList
        data={supermarkets}
        keyExtractor={(item) => item.SellerID}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelectSupermarket(item)}
          >
            <Text style={selectedSupermarket?.SellerID === item.SellerID ? styles.selectedItem : styles.itemText}>
              {item.BranchName}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Select Supermarket" onPress={handleConfirmSelection} disabled={!selectedSupermarket} />
      <Button title="Scan QR Code" onPress={handleScanQRCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
});

export default SelectSupermarketScreen;
