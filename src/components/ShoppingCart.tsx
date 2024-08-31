import React from 'react';
import { ShopInventory } from 'src/models';
import { StyleSheet, Text, View, Modal, FlatList, Pressable } from 'react-native';

interface ShoppingCartProps {
  itemInCard: ShopInventory[];
  isOpen: boolean;
  onRequestClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onRequestClose, itemInCard }) => {
  const calculateTotalPrice = () => {
    return itemInCard.reduce((total, item) => {
      const discount = item.Discount || 0;
      const priceAfterDiscount = item.Price * (1 - discount / 100);
      return total + priceAfterDiscount * item.Quantity;
    }, 0).toFixed(2);
  };

  return (
    <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Shopping Cart</Text>
          <FlatList
            data={itemInCard}
            keyExtractor={(item) => item.ItemName.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>
                  {item.ItemName} (Quantity: {item.Quantity}) - ${item.Price.toFixed(2)} each
                </Text>
              </View>
            )}
          />
          <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice()}</Text>
          <Pressable style={styles.button} onPress={onRequestClose}>
            <Text style={styles.buttonText}>Close</Text>
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
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
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
});

export default ShoppingCart;