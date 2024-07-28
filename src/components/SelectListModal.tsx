import { getShoppingListsByBuyerId } from '@api/api';
import React, { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { FlatList, View, Text, Button, StyleSheet, Pressable } from 'react-native';

interface ShoppingList {
  ListID: string;
  ListName: string;
  BuyerID: string;
}

interface SelectListModalProps {
  closeModal: (selectedList: ShoppingList | null) => void;
  continueWithoutList: () => void;
}

const SelectListModal: React.FC<SelectListModalProps> = ({ closeModal, continueWithoutList }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const token = useAuth();

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const fetchedShoppingLists = await getShoppingListsByBuyerId(token);
      if (fetchedShoppingLists) {
        setShoppingLists((prevLists) => [...prevLists, ...fetchedShoppingLists]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchData(page);
      setHasFetched(true);
    }
  }, [hasFetched, page, token]);

  const handleSelectList = (list: ShoppingList) => {
    setSelectedList(list);
  };

  const handleConfirmSelection = () => {
    if (selectedList) {
      closeModal(selectedList); 
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Shopping List</Text>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectList(item)}
            style={[
              styles.listItem,
              selectedList?.ListID === item.ListID && styles.selectedItem,
            ]}
          >
            <Text style={styles.listItemText}>{item.ListName}</Text>
          </Pressable>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
        contentContainerStyle={styles.list}
      />
      <Button onPress={handleConfirmSelection} disabled={!selectedList} title="Confirm Selection" />
      <Button onPress={continueWithoutList} title="Continue Without List" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#cce5ff',
  },
  listItemText: {
    fontSize: 16,
  },
});

export default SelectListModal;
