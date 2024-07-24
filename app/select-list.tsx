import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getShoppingListsByBuyerId } from '../src/api/api';
import { ShoppingList } from '../src/models';
import { useToken } from '../src/context/TokenContext';
import useAuth from '../src/hooks/useAuth';

const SelectListScreen = () => {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const token = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedShoppingLists = await getShoppingListsByBuyerId(token);
        if (fetchedShoppingLists) {
          setShoppingLists(fetchedShoppingLists);
        }
        setIsDataFetched(true);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectList = (list: ShoppingList) => {
    setSelectedList(list);
  };

  const handleConfirmSelection = () => {
    if (selectedList) {
      // Navigate to the SelectSupermarketScreen with the selected list
      router.push({
        pathname: '/select-supermarket',
        params: { listId: selectedList.ListID }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Shopping List</Text>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => handleSelectList(item)}
          >
            <Text style={selectedList?.ListID === item.ListID ? styles.selectedItem : styles.itemText}>
              {item.ListName}
            </Text>
          </Pressable>
        )}
      />
      <Pressable onPress={handleConfirmSelection} disabled={!selectedList} style={styles.button}>
        <Text>Select List</Text>
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
  itemText: {
    fontSize: 18,
  },
  selectedItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  button: {
    // Add your button styles here
  },
});

export default SelectListScreen;
