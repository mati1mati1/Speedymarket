import React from 'react';
import { Modal, View, Text, FlatList, Pressable } from 'react-native';
import { ShoppingListItem } from 'src/models';
import { ItemWithLocation } from 'src/services/mapService';
import styles from '../styles/PopUpWindow';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the 'X'

interface MissingItemsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  items: ShoppingListItem[];
  shoppingCart: ItemWithLocation[];
}

const MissingItemsModal: React.FC<MissingItemsModalProps> = ({ isOpen, onRequestClose, items }) => {
  return (
    <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          {/* Header with title aligned left and close button aligned right */}
          <View style={styles.header}>
            <Text style={styles.title}>Missing Items</Text>
            <Pressable onPress={onRequestClose}>
              <FontAwesome name="close" size={24} color="black" />
            </Pressable>
          </View>

          {/* Scrollable list of missing items with fixed height */}
          <View style={styles.scrollContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.ListItemID.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{item.ItemName} - Quantity: {item.Quantity}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MissingItemsModal;
