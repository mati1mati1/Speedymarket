import React, { useState } from 'react';
import { ShopInventory } from 'src/models';
import { StyleSheet, Text, View, Modal, FlatList, Pressable, TextInput } from 'react-native';
import { getItemBySupermarketIdAndItemName } from 'src/api/api';

interface ShoppingCartProps {
  itemInCard: ShopInventory[];
  isOpen: boolean;
  onRequestClose: () => void;
  onUpdateCart: (updatedCart: ShopInventory[]) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onRequestClose, itemInCard, onUpdateCart }) => {
  const [selectedItem, setSelectedItem] = useState<ShopInventory | null>(null); 
  const [newQuantity, setNewQuantity] = useState<number>(0); 
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false); 
  const calculateTotalPrice = () => {
    return itemInCard.reduce((total, item) => {
      const discount = item.Discount || 0;
      const priceAfterDiscount = item.Price * (1 - discount / 100);
      return total + priceAfterDiscount * item.Quantity;
    }, 0).toFixed(2);
  };

  const handleUpdateItem = async () => {
    if (selectedItem) {
      const updatedCart = await Promise.all(
        itemInCard.map(async (item) => {
          if (item.ItemName === selectedItem.ItemName) {
            try {
              const items: ShopInventory[] = await getItemBySupermarketIdAndItemName(item.SupermarketID || '', item.ItemName);
              
              if (items.length > 0 && items[0].Quantity >= newQuantity) {
                return { ...item, Quantity: newQuantity };
              } else {
                console.log('Invalid quantity or not enough stock');
                return item; 
              }
            } catch (error) {
              console.error('Error fetching item data:', error);
              return item; 
            }
          }
          return item;
        })
      );
  
      const filteredCart = updatedCart.filter(item => item.Quantity > 0);
  
      onUpdateCart(filteredCart);
  
      // Close the modal and clear selection
      setUpdateModalVisible(false);
      setSelectedItem(null);
    }
  };
  
  const handleRemoveItem = () => {
    if (selectedItem) {
      const updatedCart = itemInCard.filter((item) => item.ItemName !== selectedItem.ItemName); 
      onUpdateCart(updatedCart);
      setUpdateModalVisible(false); 
      setSelectedItem(null); 
    }
  };

  const openUpdateModal = (item: ShopInventory) => {
    setSelectedItem(item);
    setNewQuantity(item.Quantity); 
    setUpdateModalVisible(true); 
  };

  return (
    <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
      <Pressable style={styles.modalOverlay} onPress={() => {}}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <View style={styles.container}>
            <Text style={styles.title}>Shopping Cart</Text>
            <FlatList
              data={itemInCard}
              keyExtractor={(item) => item.ItemName.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>
                    {item.ItemName} (Quantity: {item.Quantity}) - ${item.Price.toFixed(2)} each
                  </Text>
                  <Pressable style={styles.updateButton} onPress={() => openUpdateModal(item)}>
                    <Text style={styles.buttonText}>Update</Text>
                  </Pressable>
                </View>
              )}
            />
            <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice()}</Text>
            <Pressable style={styles.button} onPress={onRequestClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>

      <Modal visible={isUpdateModalVisible} transparent={true} onRequestClose={() => setUpdateModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setUpdateModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <View style={styles.updateModal}>
              <Text style={styles.modalTitle}>Update Item</Text>
              <Text>{selectedItem?.ItemName}</Text>
              <TextInput
                style={styles.input}
                value={newQuantity.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setNewQuantity(Number(value))}
              />
              <View style={styles.modalActions}>
                <Pressable style={styles.saveButton} onPress={handleUpdateItem}>
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable style={styles.removeButton} onPress={handleRemoveItem}>
                  <Text style={styles.buttonText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  listItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
  },
  updateButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  updateModal: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
});

export default ShoppingCart;
