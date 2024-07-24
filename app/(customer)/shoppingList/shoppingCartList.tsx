import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal } from 'react-native';
import { getShoppingListsByBuyerId } from '../../../src/api/api';
import { ShoppingList } from '../../../src/models';
import { useRouter } from 'expo-router';
import { useToken } from '../../../src/context/TokenContext';
import useAuth from '../../../src/hooks/useAuth';

const ShoppingCartListScreen = () => {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const token = useAuth();
  debugger;

  useEffect(() => {
    const fetchData = async () => {
      const storedShoppingLists = await getShoppingListsByBuyerId(token);
      console.log(storedShoppingLists);
      if (storedShoppingLists) {
        setShoppingLists(storedShoppingLists);
      }
    };

    fetchData();
  }, []);

  const handleAddCart = () => {
    const url = `/shoppingList/0`;
    router.push(url);  };

  const handleEditCart = (cartId: string) => {
    debugger;
    const url = `/shoppingList/${cartId}`;
    router.push(url);
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
});

export default ShoppingCartListScreen;
