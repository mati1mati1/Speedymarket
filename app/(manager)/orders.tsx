import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker'; 
import { getAllSuppliers, getSupplierInventory } from '../../src/api/api';
import { SupplierInventory, User } from '../../src/models';

export default function OrderManagementScreen() {
  const [orders, setOrders] = useState<any>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);
  const [inventory, setInventory] = useState<SupplierInventory[]>([]); 
  const [selectedItems, setSelectedItems] = useState<{ id: number; qty: number }[]>([]);
// Supplier mock data
const [suppliers, setSuppliers] = useState<User[]>([]);

  useEffect(() => {
    // Mock data for orders
    setOrders([
      { id: 1, name: 'Order 1', totalAmount: 200, dateCreated: '01-09-2023', status: 'Pending', items: [{ name: 'Item A', qty: 2, price: 50 }, { name: 'Item B', qty: 1, price: 100 }] },
      { id: 2, name: 'Order 2', totalAmount: 300, dateCreated: '10-09-2023', status: 'Shipped', items: [{ name: 'Item C', qty: 3, price: 100 }] },
    ]);

    const fetchSuppliers = async () => {
      try {  
        let suppliers = await getAllSuppliers();
        setSuppliers(suppliers);
      } catch(e) {
        console.log(e);
      }
    };
    fetchSuppliers();
  }, []);

  const handleOrderExpand = (orderId: number) => {
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const handleAddOrder = () => {
    setModalVisible(true);
    setSelectedItems([]);
  };

  const handleSupplierSelect = async (supplier: User | null) => {
    setSelectedSupplier(supplier);
    // Mock supplier inventory
    if (supplier != null) {
      let inventory = await getSupplierInventory(supplier.UserID);
      setInventory(inventory);
      // setInventory([
      //   { id: 1, name: 'Item X', price: 50 },
      //   { id: 2, name: 'Item Y', price: 75 },
      //   { id: 3, name: 'Item Z', price: 100 },
      //   { id: 1, name: 'Item X', price: 50 },
      //   { id: 2, name: 'Item Y', price: 75 },
      //   { id: 3, name: 'Item Z', price: 100 },
      //   { id: 1, name: 'Item X', price: 50 },
      //   { id: 2, name: 'Item Y', price: 75 },
      //   { id: 3, name: 'Item Z', price: 100 },
      //   { id: 1, name: 'Item X', price: 50 },
      //   { id: 2, name: 'Item Y', price: 75 },
      //   { id: 3, name: 'Item Z', price: 100 },
      //   { id: 1, name: 'Item X', price: 50 },
      //   { id: 2, name: 'Item Y', price: 75 },
      //   { id: 3, name: 'Item Z', price: 100 },
      // ]);
    }
  };

  const handleItemSelect = (itemId: string, qty: number) => {
    // setSelectedItems((prevItems) => {
    //   const existingItem = prevItems.find(item => item.id === itemId);
    //   if (existingItem) {
    //     return prevItems.map(item => item.id === itemId ? { ...item, qty } : item);
    //   }
    //   return [...prevItems, { id: itemId, qty }];
    // });
  };

  const getStatusWithIcon = (orderStatus: string) => {
    let statusText = '';
    let textColor = '';
  
    switch(orderStatus) {
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
        statusText = 'Pending 🕒';
        textColor = '#F6BE00';
        break;
      default:
        statusText = 'Unknown ❌';
        textColor = 'gray';
        break;
    }
  
    return (
      <Text style={{ color: textColor }}>
        {statusText}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Management</Text>
      
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <TouchableOpacity onPress={() => handleOrderExpand(item.id)} style={styles.orderContainer}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{item.name}</Text>
                <Text style={styles.orderDetails}><span style={{fontWeight: 'bold'}}>Amount:</span> ${item.totalAmount}     |     <span style={{fontWeight: 'bold'}}>Date:</span> {item.dateCreated}     |     <span style={{fontWeight: 'bold'}}>Status:</span> {getStatusWithIcon(item.status)}</Text>
                <Text>{expandedOrderId === item.id ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {expandedOrderId === item.id && (
              <View style={styles.orderItems}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderRow}>Item</Text>
                  <Text style={styles.tableHeaderRow}>Qty</Text>
                  <Text style={styles.tableHeaderRow}>Price</Text>
                </View>
                {item.items.map((orderItem, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableColumn}>{orderItem.name}</Text>
                    <Text style={styles.tableColumn}>{orderItem.qty}</Text>
                    <Text style={styles.tableColumn}>${orderItem.price}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <RNEButton
                title="+ Add New Order"
                buttonStyle={[styles.blueButton, { marginTop: 20}]}
                onPress={handleAddOrder}        
      />  

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => {setModalVisible(false); setSelectedSupplier(null); setInventory([])}}>
        <Pressable onPress={() => {setModalVisible(false); setSelectedSupplier(null); setInventory([])}} style={styles.closeButton}>
          <Icon name="close" size={24} color="#007bff" />
        </Pressable>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create New Order</Text>
          <Picker
              selectedValue={selectedSupplier}
              onValueChange={(supplier) => handleSupplierSelect(supplier)}
              style={styles.picker}
            >
            <Picker.Item label="Select a supplier" value={null} />
            {suppliers.map((supplier) => (
            <Picker.Item key={supplier.UserID} label={supplier.FirstName +" " + supplier.LastName} value={supplier.UserID} />
            ))}
          </Picker>

{selectedSupplier && (
  <View>
    <Text style={styles.inventoryTitle}>Supplier Inventory</Text>

    <ScrollView style={styles.inventoryScroll}>
      {inventory.map((item) => (
        <View key={item.InventoryID} style={styles.inventoryItem}>
          <Text>{item.ItemName} - Price: ${item.Price}</Text>
          <TextInput
            placeholder="Qty"
            keyboardType="numeric"
            onChangeText={(qty) => handleItemSelect(item.InventoryID, parseInt(qty))}
            style={styles.qtyInput}
          />
        </View>
      ))}
    </ScrollView>
  </View>
)}
          <RNEButton
                title=" Save Order"
                icon={
                    <Icon name="save" size={20} color="#fff" />
                }
                buttonStyle={[styles.blueButton, { marginTop: 20}]}
                onPress={() => {setModalVisible(false); setSelectedSupplier(null); setInventory([])}}        
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    fontWeight: 'bold'
  },
  tableColumn: {
    flex: 1, // Adjust column width
    textAlign: 'center',
  },
  orderItem: {
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 14,
  },
  orderItems: {
    paddingLeft: 20,
    marginTop: 5
  },
  orderItemDetail: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  inventoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  qtyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 50,
    textAlign: 'center',
  },
  orderContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15
  },
  blueButton: {
    backgroundColor: '#007AFF',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  closeButton: {
    marginTop: 10,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  inventoryScroll: {
    maxHeight: 300, 
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  }
});
