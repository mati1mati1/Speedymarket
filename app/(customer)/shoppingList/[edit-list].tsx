import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../../src/hooks/useAuth';
import { ShoppingListItem } from '../../../src/models';
import { addOrUpdateShoppingListByBuyerId, getShoppingListItemByCardId } from '../../../src/api/api';

export default function EditListScreen() {
  const { cardId,ListName} = useLocalSearchParams<{ cardId: string; ListName?: string }>();  
  const token = useAuth();
  const navigation = useNavigation();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("cardId:", cardId);
        console.log("ListName:", ListName);

        if (cardId !== '0') {
          const fetchedItems = await getShoppingListItemByCardId(cardId || '');
          setItems(fetchedItems);
        }
        console.log("cardId:", cardId);
        if (ListName !== '') {
          debugger
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
        ItemID: Date.now().toString(), ItemName: newItem, Quantity: 1,
        ListItemID: '',
        ListID: ''
      }]);
      setNewItem('');
    }
  };

  const saveList = async () => {
    // const listId = localParams["cartId"] || Date.now().toString();
    // await addOrUpdateShoppingListByBuyerId(listId, JSON.stringify(items), token);
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
      <Pressable style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
      <FlatList
        data={items}
        renderItem={({ item }) => <Text style={styles.item}>{item.ItemName}</Text>}
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
