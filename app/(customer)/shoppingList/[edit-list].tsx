import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../../src/hooks/useAuth';
import { ShoppingListItem } from '../../../src/models';
import { updateShoppingListItems, getShoppingListItemByCardId, createShoppingList } from '../../../src/api/api';
import { changeShoppingListQuery } from '../../../src/queries';

export default function EditListScreen() {
  let { cardId, ListName } = useLocalSearchParams<{ cardId: string; ListName?: string }>();  
  const token = useAuth();
  const navigation = useNavigation();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("cardId:", cardId);
        console.log("ListName:", ListName);

        if (cardId! && cardId !== '0' && cardId !== '') {
          const fetchedItems = await getShoppingListItemByCardId(cardId || '');
          setItems(fetchedItems);
        }
        console.log("cardId:", cardId);
        if (ListName !== '') {
          setListName(ListName || '');
        }
      } catch (error) {
        console.error('Error fetching shopping list items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cardId, ListName]);

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, {
        ItemID: Date.now().toString(), ItemName: newItem, Quantity: parseInt(newQuantity),
        ListItemID: '',
        ListID: ''
      }]);
      setNewItem('');
      setNewQuantity('1');
    }
  };

  const saveList = async () => {
    debugger;
    if (!(cardId! && cardId !== '0' && cardId !== '')) {
      const response = await createShoppingList(listName,token)[0];
      cardId = response[0].ListID; 
    }
    if (ListName !== listName) {
      await changeShoppingListQuery(cardId || '', listName);
    }
    await updateShoppingListItems(cardId || '', items);    
    navigation.goBack();
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
      <View style={styles.header}>
        <Pressable style={styles.topButton} onPress={() => navigation.goBack()}>
          <Text style={styles.topButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Edit Shopping List</Text>
        <Pressable style={styles.topButton} onPress={saveList}>
          <Text style={styles.topButtonText}>Save</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.input}
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
      <TextInput
        style={styles.input}
        value={newQuantity}
        onChangeText={setNewQuantity}
        placeholder="Enter quantity"
        keyboardType="numeric"
      />
      <Pressable style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{item.ItemName}</Text>
            <Text style={styles.quantity}>Quantity: {item.Quantity}</Text>
          </View>
        )}
        keyExtractor={(item) => item.ItemID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  topButton: {
    padding: 10,
  },
  topButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  title: {
    fontSize: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  item: {
    fontSize: 18,
  },
  quantity: {
    fontSize: 18,
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
