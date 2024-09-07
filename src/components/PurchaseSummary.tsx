import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ShopInventory } from 'src/models';
import { createPurchaseQuery } from 'src/api/api'; 

interface PurchaseSummaryProps {
  sessionId: string | null; 
  items: ShopInventory[];
  totalAmount: string;
  supermarketId: string;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({ sessionId, items, totalAmount , supermarketId }) => {
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
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase Summary</Text>
      <Text>Order ID: {purchaseId}</Text>
      <Text>Total Amount Paid: ${totalAmount}</Text>

      <Text style={styles.subtitle}>Items:</Text>
      {items.map((item) => (
        <View key={item.InventoryID} style={styles.itemRow}>
          <Text>{item.ItemName} (x{item.Quantity})</Text>
          <Text>${item.Price}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
});

export default PurchaseSummary;
