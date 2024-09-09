import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Add this import
import { getOrderByBuyerIdOrderId, getOrderDetailsByOrderId } from '../../../src/api/api'; 
import { useLocalSearchParams } from 'expo-router';
import { BuyerOrder, BuyerOrderItem } from '../../../src/models';

const PurchaseDetailsScreen = () => {
  const { purchaseId } = useLocalSearchParams<{ purchaseId: string }>();
  const navigation = useNavigation(); // Use navigation hook
  const [orderDetails, setOrderDetails] = useState<BuyerOrder | null>(null);
  const [orderItems, setOrderItems] = useState<BuyerOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderByBuyerIdOrderId(purchaseId);
      setOrderDetails(response[0]);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const fetchOrderItems = async () => {
    try {
      const response = await getOrderDetailsByOrderId(purchaseId);
      setOrderItems(response);
    } catch (error) {
      console.error("Failed to fetch order items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchOrderItems();
  }, [purchaseId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      {orderDetails ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Purchase Summary</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{orderDetails.OrderID}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>${orderDetails.TotalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{new Date(orderDetails.CreationDate).toLocaleDateString('en-US')}</Text>
          </View>

          <Text style={styles.subtitle}>Items:</Text>
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <View key={item.OrderItemID} style={styles.itemCard}>
                <Text style={styles.itemText}>
                  {item.ItemName} - {item.Quantity} x ${item.Price.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text>No items found for this order.</Text>
          )}
        </View>
      ) : (
        <Text>No order details available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#888',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PurchaseDetailsScreen;
