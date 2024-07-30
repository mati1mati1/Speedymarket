import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput } from 'react-native';

interface QuantityModalProps {
  visible: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

const QuantityModal: React.FC<QuantityModalProps> = ({ visible, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(parseInt(text) || 1)}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Add to Cart" onPress={() => onAddToCart(quantity)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default QuantityModal;
