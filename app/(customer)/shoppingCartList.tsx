import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import EditCard from '../../src/components/EditCard';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
}

interface ShoppingList {
  ListID: string;
  ListName: string;
  BuyerID: string;
  Items: string; // This will be JSON string
}

const ShoppingCartListScreen = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const storedShoppingLists = await AsyncStorage.getItem('ShoppingLists');
      if (storedShoppingLists) {
        const parsedShoppingLists: ShoppingList[] = JSON.parse(storedShoppingLists);
        setShoppingLists(parsedShoppingLists);
      }
    };
  
    fetchData();
  }, []);

  const handleAddCart = () => {
    setSelectedCartId(null);
    setModalVisible(true);
  };

  const handleEditCart = (cartId: string) => {
    setSelectedCartId(cartId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart Lists</Text>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => handleEditCart(item.ListID)}
          >
            <Text>{item.ListName}</Text>
          </Pressable>
        )}
      />
      <Pressable style={styles.button} onPress={handleAddCart}>
        <Text style={styles.buttonText}>Add Shopping Cart</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <EditCard closeModal={closeModal} cartId={selectedCartId} />
          </View>
        </View>
      </Modal>
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
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
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
  },
});

export default ShoppingCartListScreen;
