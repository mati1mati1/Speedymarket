import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import Item from '../components/inventoryThings/Item';
import { getInventoryBySellerId } from '../api/api';
import { useUser } from '../context/UserContext';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[]>([]);

  const parseData = (data: any) => {
    return data.map((item: any) => ({
      id: item.ItemNumber,
      name: item.ItemName,
      quantity: item.Quantity,
      price: item.Price,
      imageUrl: item.ImageUrl,
    }));
  };

  useEffect(() => {
    // Fetch inventory data from the server using the API
    // const currUser = useUser();
    // const response = getInventoryBySellerId(currUser.id);
    // setInventory(parseData(response));
    setInventory([
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Banana', price: 5, quantity: 10, id: 1, imageUrl: 'https://ibb.co/wgM4gP5' },
      { name: 'Flour', price: 10, quantity: 5, id: 2, imageUrl: 'https://i.ibb.co/kBqqMyX/flour.png' },
      { name: 'Milk', price: 3, quantity: 20, id: 3, imageUrl: 'https://ibb.co/0fV65ZK' },
      { name: 'Eggs', price: 4, quantity: 15, id: 4, imageUrl: 'https://ibb.co/0fV65ZK' },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Inventory</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <FlatList
          data={inventory}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Item {...item} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={5} // Adjust as needed
        />
      </ScrollView>
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
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    margin: 5,
    width: '20%', // Adjust based on numColumns
  },
});
