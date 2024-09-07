import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { getOrdersByBuyerId } from 'src/api/api';
import { BuyerOrder } from 'src/models';
import { router } from 'expo-router';

const PurchaseHistoryScreen = () => {
  const [purchases, setPurchases] = useState<BuyerOrder[]>([]);
  const navigation = useNavigation(); // Initialize navigation

  const fetchPurchases = async () => {
    const response = await getOrdersByBuyerId();
    setPurchases(response);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const viewToFullDetails = (orderId: string) => {
    router.push({
      pathname: '/purchaseHistory/[purchaseId]',
      params: { 'purchaseId': orderId}
    });
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.OrderID.toString()}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.item}
            onPress={() => viewToFullDetails(item.OrderID)} // Navigate to the OrderDetails screen
          >
            <Text>
              Date: {new Date(item.CreationDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            <Text>Total: ${item.TotalAmount.toFixed(2)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default PurchaseHistoryScreen;
