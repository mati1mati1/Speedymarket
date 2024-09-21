import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { ShopInventory } from 'src/models';
import { createPurchaseQuery } from 'src/api/api'; 
import { router } from 'expo-router';

interface PurchaseSummaryProps {
  sessionId: string | null; 
  items: ShopInventory[];
  totalAmount: string;
  supermarketId: string;
  onRequestClose: () => void;  
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({ sessionId, items, totalAmount, supermarketId, onRequestClose }) => {
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storePurchase = async () => {
      setLoading(true);
      try {
        const purchaseId = await createPurchaseQuery(items, supermarketId, sessionId, totalAmount);
        setPurchaseId(purchaseId);
      } catch (error) {
        console.error('Failed to store purchase:', error);
      } finally {
        setLoading(false);
      }
    };

    storePurchase();
  }, [sessionId, items, totalAmount]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleFinish = () => {
    router.push("/shopping/supermarketMapsScreen");  // Navigate to another screen
    onRequestClose();  // Close the modal/popup
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Purchase Summary</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID:</Text>
          <Text style={styles.detailValue}>{purchaseId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount Paid:</Text>
          <Text style={styles.totalAmount}>${totalAmount}</Text>
        </View>

        <Text style={styles.subtitle}>Items Purchased:</Text>
        {items.map((item) => (
          <View key={item.InventoryID} style={styles.itemCard}>
            <Text style={styles.itemText}>
              {item.ItemName} (x{item.Quantity}) - ${item.Price.toFixed(2)}
            </Text>
          </View>
        ))}
        <Text style={styles.title}>Thank you for your purchase!</Text>
        <Pressable style={styles.actionButton} onPress={handleFinish}>
          <Text style={styles.actionButtonText}>Finish</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
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
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  actionButton: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PurchaseSummary;
