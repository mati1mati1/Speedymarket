import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker'; 
import { getAllSuppliers, getSupplierInventory, createSuperMarketOrder, getSupermarketByUserId, getOrdersBySupermarketId, getOrderDetailsByOrderId } from '../../src/api/api';
import { OrderItem, Supermarket, SupplierInventory, SupplierOrder, User } from '../../src/models';

export default function OrderManagementScreen() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);
  const [inventory, setInventory] = useState<SupplierInventory[]>([]); 
  const [selectedItems, setSelectedItems] = useState<{ item: SupplierInventory, quantity: number }[]>([]);
  const [supermarketID, setSupermarketID] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<OrderItem[] | null>(null);
  const [suppliers, setSuppliers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {  
        const supermarket = await getSupermarketByUserId();
        if (supermarket) {
          setSupermarketID(supermarket[0].SupermarketID);
        }
        const suppliers = await getAllSuppliers();
        if (suppliers) {
          setSuppliers(suppliers);
        }
        const orders = await getOrdersBySupermarketId(supermarket[0].SupermarketID);
        if (orders) {
          setOrders(orders);
        }

      } catch(e) {
        console.error('Failed to fetch data: ', e);
      }
    };
    fetchData();


  }, []);

  const handleOrderExpand = async (orderId: string) => {
    if (orderId === expandedOrderId) {
      setExpandedOrderId(null);
      setOrderDetails(null);
    }
    else {
      setExpandedOrderId(orderId);
      const orderDetails = await getOrderDetailsByOrderId(orderId);
      console.log(orderDetails);
      setOrderDetails(orderDetails);
    }
  };

  const handleAddOrder = () => {
    setModalVisible(true);
  };

  const handleSupplierSelect = async (supplierId: string) => {
    setSelectedSupplier(suppliers.find(supplier => supplier.UserID === supplierId) || null);
    if (supplierId != '') {
      let inventory = await getSupplierInventory(supplierId);
      setInventory(inventory);
    }
  };

  const handleItemSelect = (item: SupplierInventory, qty: number) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find(existingItem => existingItem.item.InventoryID === item.InventoryID);
      if (existingItem) {
        return prevItems.map(existingItem => existingItem.item.InventoryID === item.InventoryID ? { ...existingItem, quantity: qty } : existingItem);
      }
      return [...prevItems, { item, quantity: qty }];
    });
  };

  const createOrderItems = (selectedItems: { item: SupplierInventory, quantity: number }[]): OrderItem[] => {
    return selectedItems.map(({ item, quantity }) => ({
      ItemID: item.InventoryID,
      ItemName: item.ItemName,
      Quantity: quantity,
      Price: item.Price
    }));
  };
  
  const handleSaveOrder = async (selectedItems: { item: SupplierInventory, quantity: number }[]) => {

    const orderItems: OrderItem[] = createOrderItems(selectedItems);
    
    // Calculate total amount for the order
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0);
  
    try {
      let orderID = await createSuperMarketOrder(supermarketID, totalAmount, 'Pending', orderItems);
    } catch (e) {
      console.log("Could not create order."); //TODO: insert toast
    }

    await refreshOrders();
    closeModal();
  };

  const refreshOrders = async () => {
    const orders = await getOrdersBySupermarketId(supermarketID);
    setOrders(orders);
  }

  const closeModal = () => {
    setModalVisible(false); 
    setSelectedSupplier(null); 
    setInventory([]);
    setSelectedItems([]);
  }

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
            <TouchableOpacity onPress={() => handleOrderExpand(item.OrderID)} style={styles.orderContainer}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{item.OrderID}</Text>
                <Text style={styles.orderDetails}><span style={{fontWeight: 'bold'}}>Amount:</span> ${item.TotalAmount}     |     <span style={{fontWeight: 'bold'}}>Date:</span> {item.CreationDate}     |     <span style={{fontWeight: 'bold'}}>Status:</span> {getStatusWithIcon(item.OrderStatus)}</Text>
                <Text>{expandedOrderId === item.OrderID ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {expandedOrderId === item.OrderID && (
              <View style={styles.orderItems}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderRow}>Item</Text>
                  <Text style={styles.tableHeaderRow}>Qty</Text>
                  <Text style={styles.tableHeaderRow}>Price</Text>
                </View>
                {orderDetails != null && orderDetails.map((orderItem, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableColumn}>{orderItem.ItemName}</Text>
                    <Text style={styles.tableColumn}>{orderItem.Quantity}</Text>
                    <Text style={styles.tableColumn}>${orderItem.Price}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.OrderID.toString()}
      />

      <RNEButton
                title="+ Add New Order"
                buttonStyle={[styles.blueButton, { marginTop: 20}]}
                onPress={handleAddOrder}        
      />  

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => closeModal()}>
        <Pressable onPress={() => closeModal()} style={styles.closeButton}>
          <Icon name="close" size={24} color="#007bff" />
        </Pressable>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create New Order</Text>
          <Picker
              selectedValue={selectedSupplier?.UserID}
              onValueChange={(supplierId) => handleSupplierSelect(supplierId)}
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
            onChangeText={(qty) => handleItemSelect(item, parseInt(qty))}
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
                onPress={() => handleSaveOrder(selectedItems)}        
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