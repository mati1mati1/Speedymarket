import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { ItemWithLocation } from 'src/services/mapService';
import styles from '../styles/PopUpWindow'; 
import BouncyCheckbox from "react-native-bouncy-checkbox";
import customAlert from './AlertComponent'; 
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the 'X'

interface FoundItemsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  items: ItemWithLocation[];
  checkedItems: { [key: string]: boolean };
  onCheckboxChange: (itemId: string) => void;
  addToCart: (item: string, quantity: number) => void; 
}

const FoundItemsModal: React.FC<FoundItemsModalProps> = ({ isOpen, onRequestClose, items, checkedItems, onCheckboxChange, addToCart }) => {
  const [isQuantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithLocation | null>(null);
  const [quantity, setQuantity] = useState('1'); 

  const handleAddToCartPress = (item: ItemWithLocation) => {
    setSelectedItem(item);
    setQuantity('1'); 
    setQuantityModalOpen(true);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem || parseInt(quantity) <= 0) {
      customAlert('Invalid Quantity', 'Please select a valid quantity.');
      return;
    }
    addToCart(selectedItem.ItemName, parseInt(quantity)); 
    setQuantityModalOpen(false);
  };

  return (
    <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
      <Pressable style={styles.modalOverlay} onPress={onRequestClose}>
        <Pressable style={styles.modalContent} onPress={() => { }}>
          {/* Modal Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Found Items</Text>
            <Pressable onPress={onRequestClose}>
              <FontAwesome name="close" size={24} color="black" />
            </Pressable>
          </View>
          
          {/* Scrollable List of Items */}
          <View style={styles.scrollContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.ListItemID.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Pressable onPress={() => onCheckboxChange(item.ListItemID)} style={{width:160}}>
                    <BouncyCheckbox
                      isChecked={checkedItems[item.ListItemID]}
                      onPress={() => onCheckboxChange(item.ListItemID)}
                    />
                    <Text style={styles.listItemText}>
                      {item.ItemName} Quantity: {item.Quantity} Shelf: {item.shelfId}
                    </Text>
                  </Pressable>
                  <Pressable style={[styles.addButton, styles.line]} onPress={() => handleAddToCartPress(item)}>
                    <Text style={styles.buttonText}>+</Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </Pressable>
      </Pressable>

      {/* Modal for selecting quantity */}
      {selectedItem && (
        <Modal visible={isQuantityModalOpen} onRequestClose={() => setQuantityModalOpen(false)} transparent={true}>
          <Pressable style={styles.modalOverlay} onPress={() => setQuantityModalOpen(false)}>
            <Pressable style={styles.modalContent} onPress={() => { }}>
              <Text style={styles.title}>Select Quantity for {selectedItem.ItemName}</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
              <Pressable style={styles.button} onPress={handleConfirmAddToCart}>
                <Text style={styles.buttonText}>Confirm</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => setQuantityModalOpen(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </Modal>
  );
};

export default FoundItemsModal;
