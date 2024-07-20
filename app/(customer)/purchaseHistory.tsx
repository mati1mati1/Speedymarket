import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const purchases = [
  { id: '1', date: '2023-07-01', total: 100.0 },
  { id: '2', date: '2023-07-15', total: 50.0 },
  { id: '3', date: '2023-08-01', total: 200.0 },
];

const PurchaseHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase History</Text>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Date: {item.date}</Text>
            <Text>Total: ${item.total.toFixed(2)}</Text>
          </View>
        )}
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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default PurchaseHistoryScreen;
