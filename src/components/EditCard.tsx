import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from 'react-native';
import { addOrUpdateShoppingListByBuyerId } from '../api/api';
import { useToken } from '../context/TokenContext';
import useAuth from '../hooks/useAuth';

interface EditCardScreenProps {
  closeModal: () => void;
  cartId: string | null;
}

const EditCard: React.FC<EditCardScreenProps> = ({ closeModal, cartId }) => {
  const [items, setItemAsyncs] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [listName, setListName] = useState('');
  const token = useAuth();
  
  useEffect(() => {
    if (cartId) {
      // Load existing list from database or state
      // setItemAsyncs(existingListItems);
    }
  }, [cartId]);

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItemAsyncs([...items, newItem]);
      setNewItem('');
    }
  };

  const saveList = async () => {
    const listId = cartId || 'newId'; // Generate a new ID if creating a new list
    const buyerId = 'currentBuyerId'; // Replace with actual buyer ID
    await addOrUpdateShoppingListByBuyerId(listId, JSON.stringify(items),token);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>✖</Text>
        </Pressable>
        <Text style={styles.title}>Edit Shopping List</Text>
      </View>
      <TextInput
        style={styles.nameInput}
        value={listName}
        onChangeText={setListName}
        placeholder="Enter list name"
      />
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
        style={styles.list}
      />
      <Pressable style={styles.button} onPress={saveList}>
        <Text style={styles.buttonText}>Save List</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: 'black',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  },
  nameInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  list: {
    marginBottom: 20,
  },
  item: {
    padding: 10,
    fontSize: 16,
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


