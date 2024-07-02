import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function OrderManagement() {
  const [orders, setOrders] = useState<{ id: number; product: string; status: string }[]>([]);

  useEffect(() => {
    // לוגיקה לטעינת הזמנות ממקור נתונים
    setOrders([
      { id: 1, product: 'Product 1', status: 'Pending' },
      { id: 2, product: 'Product 2', status: 'Shipped' },
      // הזמנות נוספות...
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Management</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.product} - Status: {item.status}
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
