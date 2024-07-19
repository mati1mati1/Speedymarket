import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { addOrUpdateShoppingListByBuyerId } from '../api/api';

type EditListScreenRouteProp = RouteProp<RootStackParamList, 'EditList'>;

const EditListScreen = () => {
  const route = useRoute<EditListScreenRouteProp>();
  const navigation = useNavigation();
  const { cartId } = route.params;
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (cartId) {
      // Load existing list from database or state
      // setItems(existingListItems);
    }
  }, [cartId]);

  const addItem = () => {
    setItems([...items, newItem]);
    setNewItem('');
  };

  const saveList = async () => {
    const listId = cartId || 'newId'; // Generate a new ID if creating a new list
    const buyerId = 'currentBuyerId'; // Replace with actual buyer ID
    await addOrUpdateShoppingListByBuyerId(listId, buyerId, JSON.stringify(items));
    // Navigate back or show success message
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Shopping List</Text>
      <Button title="Back to Shopping List" onPress={handleBackPress} />
      <TextInput
        style={styles.input}
        value={newItem}
        onChangeText={setNewItem}
        placeholder="Enter item"
      />
      <Button title="Add" onPress={addItem} />
      <FlatList
        data={items}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Save List" onPress={saveList} />
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

export default EditListScreen;
