import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, TextInput, Alert } from 'react-native';
import { ItemWithLocation } from 'src/services/mapService';
import styles from '../styles/PopUpWindow'; // Import the styles
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface FoundItemsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  items: ItemWithLocation[];
  checkedItems: { [key: string]: boolean };
  onCheckboxChange: (itemId: string) => void;
  addToCart: (item: string, quantity: number) => void; // Function to add items to the cart
}

const FoundItemsModal: React.FC<FoundItemsModalProps> = ({ isOpen, onRequestClose, items, checkedItems, onCheckboxChange, addToCart }) => {
  const [isQuantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithLocation | null>(null);
  const [quantity, setQuantity] = useState('1'); // Default quantity is 1

  // Open the quantity modal for a specific item
  const handleAddToCartPress = (item: ItemWithLocation) => {
    setSelectedItem(item);
    setQuantity('1'); // Reset quantity
    setQuantityModalOpen(true);
  };

  // Handle adding the item to the cart with the selected quantity
  const handleConfirmAddToCart = () => {
    if (!selectedItem || parseInt(quantity) <= 0) {
      Alert.alert('Invalid Quantity', 'Please select a valid quantity.');
      return;
    }
    addToCart(selectedItem.ItemName, parseInt(quantity)); // Call the addToCart function passed as a prop
    setQuantityModalOpen(false);
  };

  return (
    <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
      <Pressable style={styles.modalOverlay} onPress={() => { /* Do nothing to avoid modal close */ }}>
        <Pressable style={styles.modalContent} onPress={() => { /* To prevent modal closing when clicking inside */ }}>
          <Text style={styles.title}>Found Items</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.ListItemID.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Pressable onPress={() => onCheckboxChange(item.ListItemID)}>
                  <BouncyCheckbox
                    isChecked={checkedItems[item.ListItemID]}
                    onPress={() => onCheckboxChange(item.ListItemID)}
                  />
                  <Text style={styles.listItemText}>
                    {item.ItemName} Quantity: {item.Quantity} Shelf: {item.shelf}
                  </Text>
                </Pressable>
                <Pressable style={styles.addButton} onPress={() => handleAddToCartPress(item)}>
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </Pressable>
              </View>
            )}
          />
          <Pressable style={styles.button} onPress={onRequestClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>

      {/* Modal for selecting quantity */}
      {selectedItem && (
        <Modal visible={isQuantityModalOpen} onRequestClose={() => setQuantityModalOpen(false)} transparent={true}>
          <Pressable style={styles.modalOverlay} onPress={() => setQuantityModalOpen(false)}>
            <Pressable style={styles.modalContent} onPress={() => {}}>
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
