import React from 'react';
import { Modal, StyleSheet, View, Text, Button, FlatList, Pressable } from 'react-native';
import { ShoppingListItem } from 'src/models';
import { ItemWithLocation } from 'src/services/mapService';
import styles from '../styles/PopUpWindow'; interface MissingItemsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  items: ShoppingListItem[];
  shoppingCart: ItemWithLocation[];
}

const MissingItemsModal: React.FC<MissingItemsModalProps> = ({ isOpen, onRequestClose, items, shoppingCart }) => {
    return (
          <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
            <View style={styles.container}>
              <View style={styles.modalContent}>
                <Text style={styles.title}>Missing Items</Text>
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.ListItemID.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.listItem}>
                      <Text style={styles.listItemText}/>
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

export default MissingItemsModal;