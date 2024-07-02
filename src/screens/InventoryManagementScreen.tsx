import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<{ id: number; name: string; quantity: number }[]>([]);

  useEffect(() => {
    // לוגיקה לטעינת מלאי ממקור נתונים
    setInventory([
      { id: 1, name: 'Item 1', quantity: 10 },
      { id: 2, name: 'Item 2', quantity: 5 },
      // פריטים נוספים...
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>
      <FlatList
        data={inventory}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.name} - Quantity: {item.quantity}
          </Text>
        )}
        keyExtractor={(item) => item.id.toString()}
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
