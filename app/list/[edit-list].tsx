import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { addOrUpdateShoppingListByBuyerId } from '../../src/api/api';

export default function Route() {
  debugger
  const { cartId } = useLocalSearchParams<{ cartId: string | ''}>();
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  useEffect(() => {
    if (cartId) {
      // Load existing list from database or state
      // setItems(existingListItems);
    }
  }, [cartId]);

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, newItem]);
      setNewItem('');
    }
  };

  const saveList = async () => {
    const listId = cartId || 'newId'; // Generate a new ID if creating a new list
    const buyerId = 'currentBuyerId'; // Replace with actual buyer ID
    await addOrUpdateShoppingListByBuyerId(listId, buyerId, JSON.stringify(items));
    // You need to implement a way to navigate back or show a success message.
    // This can be router.back(), a callback prop, or anything else.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Shopping List</Text>
      <TextInput
        style={styles.input}
        value={newItem}
        onChangeText={setNewItem}
        placeholder="Enter item"
      />
      <Pressable style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
      <FlatList
        data={items}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <Pressable style={styles.button} onPress={saveList}>
        <Text style={styles.buttonText}>Save List</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => { /* Add navigation logic here */ }}>
        <Text style={styles.buttonText}>Back to Shopping List</Text>
      </Pressable>
    </View>
  );
}

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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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
