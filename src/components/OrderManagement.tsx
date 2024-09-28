import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addShopInventory, getOrderDetailsByOrderId, getShopInventoryByItemName, updateOrderStatus, updateShopInventory, updateShopInventoryQuantityQuery } from '../../src/api/api';
import { OrderItem, ShopInventory } from '../../src/models';
import { v4 as uuidv4 } from 'uuid'; 
import customAlert from './AlertComponent';

type OrderManagementProps = {
  orderID: string;
  supermarketID: string;
  totalAmount: number;
  orderStatus: string;
  creationDate: string;
};

const OrderManagement :  React.FC<OrderManagementProps> = ({ orderID, supermarketID, totalAmount, orderStatus, creationDate}) => {
  
  const getStatusWithIcon = (status: string) => {
    let statusText = '';
    let textColor = '';

    switch (status) {
      case 'Shipped':
        statusText = 'Shipped 🚚';
        textColor = 'orange';
        break;
      case 'Delivered':
        statusText = 'Delivered ✅';
        textColor = 'green';
        break;
      case 'Cancelled':
        statusText = 'Cancelled ❌';
        textColor = 'red';
        break;
      case 'Pending':
        statusText = 'Pending ⏳';
        textColor = '#F6BE00';
        break;
      default:
        statusText = 'Unknown ❌';
        textColor = 'gray';
        break;
    }

    return <Text style={{ color: textColor }}>{statusText}</Text>;
  };

  const [expanded, setExpanded] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderItem[] | null>(null);
  const [statusText, setStatusText] = useState(orderStatus);
  const [statusIcon, setStatusIcon] = useState(getStatusWithIcon(orderStatus));
  const [addToInventoryText, setAddToInventoryText] = useState<string>('+ Add to Inventory');

  const handleOrderExpand = async () => {
    setExpanded(!expanded);
    if (!expanded) {
      const details = await getOrderDetailsByOrderId(orderID);
      setOrderDetails(details);
    }
  };

  const handleChangeStatusToDelivered = async () => {
    await updateOrderStatus(orderID, 'Delivered');
    // add toast
    // await refreshOrders();
    setStatusIcon(getStatusWithIcon('Delivered'));
    setStatusText('Delivered');
  };

  const handleAddToInventory = async (orderItems: OrderItem[] | null) => {
    if (orderItems) {
      for (const item of orderItems) {
        try {
          let savedItem = await getShopInventoryByItemName(item.ItemName);
          if (savedItem.length > 0) {
            let quantity = savedItem[0].Quantity;
            savedItem[0].Quantity = quantity + item.Quantity;
            console.log("Saved item: " + savedItem[0].Quantity);
            await updateShopInventoryQuantityQuery(savedItem[0]);
          } else {
            const inventoryItem: ShopInventory = { InventoryID: uuidv4(), SupermarketID: supermarketID, ItemName: item.ItemName, Quantity: item.Quantity, Price: 0, Discount: 0, Location: '0', Barcode: '0'};
            await addShopInventory(inventoryItem);
          }
        } 
        catch (ex) {
          customAlert("Failed to Add", "Oops, there was an issue adding this item, please try again later.");
        }
      };
      setAddToInventoryText('✔️ Added To Inventory');
    }
  };

  return (
    <View style={styles.orderCard}>
      <TouchableOpacity onPress={handleOrderExpand} style={styles.orderHeader}>
        <Text style={styles.orderTitle}>{orderID}</Text>
        <Text style={styles.orderDetails}>
          <strong>Amount:</strong> ${totalAmount} | <strong>Date:</strong> {creationDate} | <strong>Status:</strong> {statusIcon}
        </Text>
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.orderBody}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderRow}>Item</Text>
            <Text style={styles.tableHeaderRow}>Qty</Text>
            <Text style={styles.tableHeaderRow}>Price</Text>
          </View>
          <ScrollView>
            {orderDetails != null &&
              orderDetails.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableColumn}>{item.ItemName}</Text>
                  <Text style={styles.tableColumn}>{item.Quantity}</Text>
                  <Text style={styles.tableColumn}>${item.Price}</Text>
                </View>
              ))}
          </ScrollView>
                  <Pressable
            style={[styles.statusButton, statusText === 'Delivered' && styles.disabledButton]}
            onPress={handleChangeStatusToDelivered}
            disabled={statusText === 'Delivered'}
          >
            <Text style={styles.buttonText}>Mark Delivered</Text>
          </Pressable>
          <Pressable
            style={[styles.inventoryButton, (statusText !== 'Delivered' || addToInventoryText === '✔️ Added To Inventory') && styles.disabledButton]}
            onPress={() => handleAddToInventory(orderDetails)}
            disabled={statusText !== 'Delivered' || addToInventoryText === '✔️ Added To Inventory'}
          >
            <Text style={styles.buttonText}>{addToInventoryText}</Text>
          </Pressable>
          
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.01,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 14,
  },
  orderBody: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  tableHeaderRow: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableColumn: {
    flex: 1,
    textAlign: 'center',
  },
  statusButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  inventoryButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3', 
  },
  buttonText: {
    color: '#fff',
  },
});

export default OrderManagement;
