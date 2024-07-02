import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ShoppingListScreenRouteProp = RouteProp<RootStackParamList, 'ShoppingList'>;

const ShoppingListScreen = ({ route }: { route: ShoppingListScreenRouteProp }) => {
  const { cartId } = route.params;
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    setItems([...items, newItem]);
    setNewItem('');
  };

  const startShopping = () => {
    alert('Starting shopping');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List - Cart {cartId}</Text>
      <TextInput
        style={styles.input}
        value={newItem}
        onChangeText={setNewItem}
        placeholder="Enter item"
      />
      <Button title="Add Item" onPress={addItem} />
      <FlatList
        data={items}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Start Shopping" onPress={startShopping} />
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
});

export default ShoppingListScreen;
