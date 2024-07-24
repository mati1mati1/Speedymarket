import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import useAuth from '../../../src/hooks/useAuth';
import { ShoppingListItem } from '../../../src/models';
import { addOrUpdateShoppingListByBuyerId, getShoppingListItemByCardId } from '../../../src/api/api';


export default function Route() {
  debugger;
  const route = useRoute();
  const navigation = useNavigation();
  const { cartId } = useLocalSearchParams<{ cartId: string}>();
  const token = useAuth();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (cartId !== '0') {
        const items = await getShoppingListItemByCardId(cartId || '');
        setItems(items);
      }
    };
    fetchData();
  }, [cartId]);

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
    const listId = cartId || Date.now().toString();
    await addOrUpdateShoppingListByBuyerId(listId , JSON.stringify(items),token);
    navigation.goBack();
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
        renderItem={({ item }) => <Text style={styles.item}>{item.ItemName}</Text>}
        keyExtractor={(item) => item.ItemID}
      />
      <Pressable style={styles.button} onPress={saveList}>
        <Text style={styles.buttonText}>Save List</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
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
