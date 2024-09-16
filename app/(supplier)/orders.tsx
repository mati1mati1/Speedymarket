import React, { useEffect } from 'react';
import { useState } from 'react';
import OrderCard from '../../src/components/OrderCard';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import {getOrdersBySupplierId} from '../../src/api/api';
import { useAuth } from '../../src/context/AuthContext';
export default function SupplierScreen() {
  const [orders, setOrders] = useState<{ id: string; superMarket: string; totalAmount: number; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const token = authState.token;

  const parseData = (data: any) => {
    let currOrders: { id: string; superMarket: string; totalAmount: number; status: string }[] = [];
    for (let i = 0; i < data.length; i++) {
      currOrders.push({
        id: data[i].OrderID,
        superMarket: data[i].SupermarketID,
        totalAmount: data[i].TotalAmount,
        status: data[i].OrderStatus,
      });
    }
    return currOrders;
  };

  useEffect(() => {
    try {
      if (!token) {
        throw new Error('Token is missing');
      }
        getOrdersBySupplierId().then((response) => {
        // console.log(response);
        setOrders(parseData(response));
      });
    } catch (error) {
      console.log(error);
    }
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