import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';

import { useRouter } from 'expo-router';
import { getShoppingListsByBuyerId } from '../../../src/api/api';
import { ShoppingList } from '../../../src/models';
import useAuth from '../../../src/hooks/useAuth';

const ShoppingCartListScreen = () => {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedShoppingLists = await getShoppingListsByBuyerId(token);
        if (storedShoppingLists) {
          setShoppingLists(storedShoppingLists);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCart = () => {
    console.log('Add new cart');
    const url = `/shoppingList/newList`;
    router.push(url);
  };

  const handleEditCart = (cartId: string, listName: string) => {
    console.log(cartId, listName);
    router.push({
      pathname: '/shoppingList/[edit-list]',
      params: { cardId : cartId, ListName : listName }}
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => handleEditCart(item.ListID, item.ListName)}
          >
            <Text>{item.ListName}</Text>
          </Pressable>
        )}
      />
      <Pressable style={styles.button} onPress={handleAddCart}>
        <Text style={styles.buttonText}>+ New List</Text>
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
