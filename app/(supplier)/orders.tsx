import React, { useEffect } from 'react';
import { useState } from 'react';
import OrderCard from '../../src/components/OrderCard';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import {getOrdersBySupplierId} from '../../src/api/api';
import { useAuth } from '../../src/context/AuthContext';
export default function SupplierScreen() {
  const [orders, setOrders] = useState<{ id: number; superMarket: number; totalAmount: number; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const token = authState.token;
  let demoData = [
    { id: 1, superMarket: 1, totalAmount: 100, status: 'Pending' },
    { id: 2, superMarket: 2, totalAmount: 200, status: 'Shipped' },
    { id: 3, superMarket: 3, totalAmount: 300, status: 'Delivered' },
    { id: 4, superMarket: 4, totalAmount: 400, status: 'Cancelled' },
  ];


  useEffect(() => {
    try {
      if (!token) {
        throw new Error('Token is missing');
      }
      getOrdersBySupplierId().then((response) => {
        console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
    setOrders(demoData);
    setLoading(false);
  }, []);


  return (
    <View style={styles.cardRow}>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          orderID={order.id}
          supermarketID={order.superMarket}
          cost={order.totalAmount}
          status={order.status}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardRow: {

    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap', // Optional: to wrap cards to the next line if there are more than 3
  },
});