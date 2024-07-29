import React, { useState } from 'react';
import { Modal, View, Text, FlatList, Pressable } from 'react-native';
import { ItemWithLocation } from 'src/services/mapService';
import styles from '../styles/PopUpWindow'; // Import the styles

interface FoundItemsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  items: ItemWithLocation[];
  checkedItems: { [key: string]: boolean };
  onCheckboxChange: (itemId: string) => void;
}

const FoundItemsModal: React.FC<FoundItemsModalProps> = ({ isOpen, onRequestClose, items, checkedItems, onCheckboxChange }) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  return (
    <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Found Items</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.ListItemID.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Pressable onPress={() => onCheckboxChange(item.ListItemID)}>
                  <Text style={styles.listItemText}>
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.ListItemID]}
                      onChange={() => onCheckboxChange(item.ListItemID)}
                    />
                    {item.ItemName} (Quantity: {item.Quantity})
                  </Text>
                </Pressable>
              </View>
            )}
          />
          <Pressable style={styles.button} onPress={onRequestClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default FoundItemsModal;
