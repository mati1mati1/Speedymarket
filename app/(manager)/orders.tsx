import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker'; 
import { getAllSuppliers, getSupplierInventory, createSuperMarketOrder, getSupermarketByUserId, getOrdersBySupermarketIdAndUserTypeSupplierQuery, getOrderDetailsByOrderId, updateOrderStatus } from '../../src/api/api';
import { OrderItem, SupplierInventory, SupplierOrder, User } from '../../src/models';
import OrderManagement from '../../src/components/OrderManagement';

export default function OrderManagementScreen() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);
  const [inventory, setInventory] = useState<SupplierInventory[]>([]); 
  const [selectedItems, setSelectedItems] = useState<{ item: SupplierInventory, quantity: number }[]>([]);
  const [supermarketID, setSupermarketID] = useState<string>('');
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
        const orders = await getOrdersBySupermarketIdAndUserTypeSupplierQuery(supermarket[0].SupermarketID);
        if (orders) {
          setOrders(orders);
        }

      } catch(e) {
        console.error('Failed to fetch data: ', e);
      }
    };
    fetchData();


  }, []);


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
      if (!selectedSupplier) {
        console.log("Please select a supervisor!"); // TODO: toast?
      } else{
        let orderID = await createSuperMarketOrder(selectedSupplier.UserID, supermarketID, totalAmount, 'Pending', orderItems);
      }
    } catch (e) {
      console.log("Could not create order."); //TODO: insert toast
    }

    await refreshOrders();
    closeModal();
  };

  const refreshOrders = async () => {
    const orders = await getOrdersBySupermarketIdAndUserTypeSupplierQuery(supermarketID);
    setOrders(orders);
  }

  const closeModal = () => {
    setModalVisible(false); 
    setSelectedSupplier(null); 
    setInventory([]);
    setSelectedItems([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Management</Text>
      
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <OrderManagement
                key={item.OrderID}
                orderID={item.OrderID}
                supermarketID={item.SupermarketID}
                totalAmount={item.TotalAmount}
                orderStatus={item.OrderStatus}
                creationDate={item.CreationDate}
            ></OrderManagement>
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
  orderItem: {
    marginBottom: 10,
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
  },
});