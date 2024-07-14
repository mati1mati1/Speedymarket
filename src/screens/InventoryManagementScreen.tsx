import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ShopInventory } from '../models';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<ShopInventory[]>([]);

  const shopInventory = JSON.parse(sessionStorage.getItem('ShopInventory') || '{}');

  useEffect(() => {
    debugger
    setInventory([shopInventory]);
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>
      <FlatList
        data={inventory}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.ItemNumber} - Quantity: {item.Quantity}
          </Text>
        )}
        keyExtractor={(item) => item.Quantity.toString()}
      />
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
