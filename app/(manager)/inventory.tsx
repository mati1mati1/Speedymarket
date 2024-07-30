import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert, ScrollView, Dimensions } from 'react-native';
import { Table, TableWrapper, Row, Rows, Cell } from 'react-native-table-component';
import { ShopInventory } from '../../src/models';
import { addShopInventory, getShopInventory, getSupermarketByUserId, updateShopInventory } from '../../src/api/api';
import useAuth from '../../src/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<ShopInventory[]>([]);
  const [supermarketID, setSupermarketID] = useState<string>('');
  const [currentItem, setCurrentItem] = useState<ShopInventory | null>(null);
  const [form, setForm] = useState({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const token = useAuth();

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopInventory = await getShopInventory(token);
        if (shopInventory) {
          setInventory(shopInventory);
        }
        setIsDataFetched(true);
        const supermarket = await getSupermarketByUserId(token);
        if (supermarket) {
          setSupermarketID(supermarket[0].SupermarketID);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { ItemName, Quantity, Price, Discount, Location, Barcode } = form;
    if (!ItemName || !Quantity || !Price || !Discount || !Location || !Barcode) {
      Alert.alert('Validation Error', 'All fields are required');
      return false;
    }
    if (isNaN(parseInt(Quantity)) || isNaN(parseFloat(Price)) || isNaN(parseFloat(Discount))) {
      Alert.alert('Validation Error', 'Quantity, Price, and Discount must be numbers');
      return false;
    }
    return true;
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;
    const newItem: ShopInventory = {
      InventoryID: uuidv4(),
      ItemName: form.ItemName,
      Quantity: parseInt(form.Quantity),
      Price: parseFloat(form.Price),
      Discount: parseFloat(form.Discount),
      Location: form.Location,
      Barcode: form.Barcode,
      SupermarketID: supermarketID
    };
    var response = await addShopInventory(newItem);
    newItem.InventoryID = response[0];
    console.log(response);
    setInventory([...inventory, newItem]);
    setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
    setModalVisible(false);
  };

  const handleEditItem = async () => {
    if (!validateForm()) return;
    if (currentItem) {
      const updatedItem = {
        ...currentItem,
        ItemName: form.ItemName,
        Quantity: parseInt(form.Quantity),
        Price: parseFloat(form.Price),
        Discount: parseFloat(form.Discount),
        Location: form.Location,
        Barcode: form.Barcode
      };

      await updateShopInventory(updatedItem);

      const updatedInventory = inventory.map(item => 
        item.InventoryID === currentItem.InventoryID 
          ? updatedItem
          : item
      );

      setInventory(updatedInventory);
      setCurrentItem(null);
      setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
      setModalVisible(false);
    }
  };

  const handleEditClick = (item: ShopInventory) => {
    setCurrentItem(item);
    setForm({ 
      ItemName: item.ItemName, 
      Quantity: item.Quantity.toString(), 
      Price: item.Price.toString(), 
      Discount: item.Discount.toString(), 
      Location: item.Location, 
      Barcode: item.Barcode 
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const openAddItemModal = () => {
    setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const renderEditButton = (data: any, index: number) => (
    <Button title="Edit" onPress={() => handleEditClick(inventory[index])} />
  );

  return (
    <View style={styles.container}>
      <Button title="Add Item" onPress={openAddItemModal} />

      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row 
              data={['Item Name', 'Quantity', 'Price', 'Discount', 'Location', 'Barcode', 'Actions']} 
              style={styles.head} 
              textStyle={styles.text} 
              widthArr={[screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7]} 
            />
            <TableWrapper style={styles.wrapper}>
              <Rows 
                data={inventory.map(item => [
                  item.ItemName, 
                  item.Quantity, 
                  item.Price, 
                  item.Discount, 
                  item.Location, 
                  item.Barcode, 
                  renderEditButton(null, inventory.indexOf(item))
                ])} 
                textStyle={styles.text} 
                widthArr={[screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7, screenWidth / 7]} 
              />
            </TableWrapper>
          </Table>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          {['Item Name', 'Quantity', 'Price', 'Discount', 'Location', 'Barcode'].map((placeholder, index) => (
            <View style={styles.inputContainer} key={index}>
              <Text style={styles.label}>{placeholder}</Text>
              <TextInput 
                placeholder={placeholder} 
                value={form[placeholder.replace(' ', '')]} 
                onChangeText={(value) => handleFormChange(placeholder.replace(' ', ''), value)} 
                style={styles.input} 
                keyboardType={placeholder === 'Quantity' || placeholder === 'Price' || placeholder === 'Discount' ? 'numeric' : 'default'} 
              />
            </View>
          ))}

          <View style={styles.buttonRow}>
            <Button 
              title={isEditing ? "Update Item" : "Add Item"} 
              onPress={isEditing ? handleEditItem : handleAddItem} 
            />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                setCurrentItem(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  head: {
    height: 50,
    backgroundColor: '#f1f8ff',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  label: {
    width: '30%',
    textAlign: 'right',
    paddingRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '70%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
  },
});
