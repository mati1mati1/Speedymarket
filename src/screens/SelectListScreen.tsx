import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getShoppingListsByBuyerId } from '../api/api';
import { ShoppingList } from '../models';

type SelectListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectList'>;

const SelectListScreen = () => {
  const navigation = useNavigation<SelectListScreenNavigationProp>();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);

  useEffect(() => {
    const storedShoppingLists = sessionStorage.getItem('ShoppingLists');
    if (storedShoppingLists) {
      const parsedShoppingLists: ShoppingList[] = JSON.parse(storedShoppingLists);
      setShoppingLists(parsedShoppingLists);
    };
  }, []);

  const handleSelectList = (list: ShoppingList) => {
    setSelectedList(list);
  };

  const handleConfirmSelection = () => {
    if (selectedList) {
      // Navigate to the SelectSupermarketScreen with the selected list
      navigation.navigate('SelectSupermarket', { listId: selectedList.ListID });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Shopping List</Text>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelectList(item)}
          >
            <Text style={selectedList?.ListID === item.ListID ? styles.selectedItem : styles.itemText}>
              {item.ListName}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Select List" onPress={handleConfirmSelection} disabled={!selectedList} />
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
  itemText: {
    fontSize: 18,
  },
  selectedItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default SelectListScreen;
