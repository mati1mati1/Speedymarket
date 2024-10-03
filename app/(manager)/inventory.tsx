import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Alert, ScrollView, Dimensions, TouchableOpacity, Pressable, useWindowDimensions } from 'react-native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { ShopInventory } from '../../src/models';
import { addShopInventory, getShopInventory, getSupermarketByUserId, updateShopInventory, deleteShopInventory } from '../../src/api/api';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed
import ScanItem from '../../src/components/Scanner';
import { useAuth } from '../../src/context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button as RNEButton } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import customAlert from '../../src/components/AlertComponent';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<ShopInventory[]>([]);
  const [supermarketID, setSupermarketID] = useState<string>('');
  const [currentItem, setCurrentItem] = useState<ShopInventory | null>(null);
  const [form, setForm] = useState({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isScannedDataOpen, setScannedDataModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ShopInventory | null>(null);
  const { authState } = useAuth();
  const { width } = useWindowDimensions();

  const fetchData = async () => {
    try {
      const shopInventory = await getShopInventory();
      if (shopInventory) {
        setInventory(shopInventory);
      }
      setIsDataFetched(true);
      const supermarket = await getSupermarketByUserId();
      if (supermarket) {
        setSupermarketID(supermarket[0].SupermarketID);
      }
    } catch (error) {
      customAlert("Failed to Get Inventory", "Oops, there was an issue, please try again later.");
      console.error('Failed to fetch data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { ItemName, Quantity, Price, Discount, Location, Barcode } = form;
    if (!ItemName || !Quantity || !Price || !Discount || !Location || !Barcode) {
      alert('All fields are required');
      return false;
    }
    if (isNaN(parseInt(Quantity)) || isNaN(parseFloat(Price)) || isNaN(parseFloat(Discount))) {
      alert('Quantity, Price, and Discount must be numbers');
      return false;
    }
    if (inventory.some(item => item.ItemName === ItemName && (!isEditing || (isEditing && currentItem && item.InventoryID !== currentItem.InventoryID)))) {
      alert('An item with this name already exists');
      return false;
    }
    return true;
  };

  const toggleIsScannedDataOpen = () => {
    setScannedDataModalOpen(!isScannedDataOpen);
  };

  const handleScannedBarcode = async (data: string) => {
    setForm({ ...form, Barcode: data });
    setScannedDataModalOpen(false);
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
    try {
      const response = await addShopInventory(newItem);
      newItem.InventoryID = response[0];
      setInventory([...inventory, newItem]);
      setForm({ ItemName: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
      setModalVisible(false);
    } catch (error) {
      customAlert("Failed to Add Item", "Oops, there was an issue, please try again later.");
      console.error('Failed to add item:', error);
    }
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
      try {
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
      } catch (error) {
        customAlert("Failed to Update Item", "Oops, there was an issue, please try again later.");
        console.error('Failed to update item:', error);
      }
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

  const handleDeleteItem = async (item: ShopInventory) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete) {
      try {
        await deleteShopInventory(itemToDelete.InventoryID);
        setInventory(inventory.filter(i => i.InventoryID !== itemToDelete.InventoryID));
        setDeleteModalVisible(false);
        setItemToDelete(null);
      } catch (error) {
        customAlert("Failed to Delete Item", "Oops, there was an issue, please try again later.");
        console.error('Failed to delete item:', error);
      }
    }
  };

  const renderEditButton = (data: any, index: number) => (
    <View style={styles.buttonGroup}>
      <Pressable style={styles.editButton} onPress={() => handleEditClick(inventory[index])} >
              <Icon name="pencil" size={24} color="#007bFF" />
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={() => handleDeleteItem(inventory[index])}>
              <Icon name="trash" size={24} color="#FF6347" />
      </Pressable>
    </View>
  );

  const filteredInventory = inventory.filter(item =>
    item.ItemName.toLowerCase().includes(filter.toLowerCase()) ||
    item.Barcode.includes(filter)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>  
      <TextInput
        placeholder="Filter items"
        placeholderTextColor={"#808080"}
        style={styles.filterInput}
        value={filter}
        onChangeText={setFilter}
      />

      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row
                data={['Item Name', 'Quantity', 'Price', 'Discount', 'Location', 'Barcode', 'Actions']}
                style={styles.head}
                textStyle={styles.headerText}
                widthArr={[width / 7, width / 7, width / 7, width / 7, width / 7, width / 7, 80]}
              />
              <TableWrapper style={styles.wrapper}>
                <Rows
                  data={filteredInventory.map(item => [
                    item.ItemName,
                    item.Quantity,
                    item.Price,
                    item.Discount,
                    item.Location,
                    item.Barcode,
                    renderEditButton(null, inventory.indexOf(item))
                  ])}
                  textStyle={styles.text}
                  widthArr={[width / 7, width / 7, width / 7, width / 7, width / 7, width / 7, 80]}
                />
              </TableWrapper>
            </Table>
          </View>
        </ScrollView>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Pressable onPress={() => {setModalVisible(false); setCurrentItem(null);} } style={styles.closeButton}>
                <Icon name="close" size={24} color="#007bff" />
              </Pressable>
            {['Item Name', 'Quantity', 'Price', 'Discount', 'Location', 'Barcode'].map((placeholder, index) => (
              <View style={styles.inputContainer} key={index}>
                <Text style={styles.label}>{placeholder}</Text>
                {placeholder === 'Barcode' ? (
                  <View style={styles.barcodeContainer}>
                    <TextInput
                      placeholder={placeholder}
                      value={form[placeholder.replace(' ', '')]}
                      onChangeText={(value) => handleFormChange(placeholder.replace(' ', ''), value)}
                      style={[styles.input, styles.barcodeInput]}
                      keyboardType='default'
                    />
                    <RNEButton
                      title=" Scan"
                      icon={
                        <MaterialIcon
                          name="barcode-scan"
                          size={20}
                          color="white"
                        />
                      }
                      buttonStyle={styles.blueButton}
                      onPress={toggleIsScannedDataOpen}        />
                  </View>
                ) : (
                  <TextInput
                    placeholder={placeholder}
                    value={form[placeholder.replace(' ', '')]}
                    onChangeText={(value) => handleFormChange(placeholder.replace(' ', ''), value)}
                    style={styles.input}
                    keyboardType={placeholder === 'Quantity' || placeholder === 'Price' || placeholder === 'Discount' ? 'numeric' : 'default'}
                  />
                )}
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <RNEButton
                title={isEditing ? "Update Item" : "Add Item"}
                onPress={isEditing ? handleEditItem : handleAddItem}
                buttonStyle={styles.blueButton}
              />
              </View>
              <View style={styles.buttonRow}>

              <Modal visible={isScannedDataOpen} transparent={true} onRequestClose={toggleIsScannedDataOpen}>
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleIsScannedDataOpen}>
                  <View style={styles.modal} onStartShouldSetResponder={() => true}>
                    <ScanItem handleData={handleScannedBarcode} />
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Pressable onPress={() => setDeleteModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#007bff" />
            </Pressable>
            <Text style={styles.modalText}>Are you sure you want to delete this item?</Text>
              <Pressable style={[styles.modalButton, styles.deleteButton, styles.deleteButtonNoIcon]} onPress={confirmDeleteItem}>
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
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
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
},
  head: {
    height: 50,
    backgroundColor: '#f1f8ff',
  },
  headerText: {
    margin: 6,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  wrapper: {
    flexDirection: 'row',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
    width: '100%',
  },
  label: {
    width: '30%',
    textAlign: 'left',
    paddingLeft: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '70%',
    paddingRight: 50
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '95%',
    paddingRight: 50
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
    width: '50%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  closeButton: {
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  blueButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  barcodeInput: {
    flex: 1, 
    width: '80%'
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonNoIcon: {
    backgroundColor: 'red',
    marginTop: 20,
  },
  editButton: {
    padding: 10,
    borderRadius: 5
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    height: 40,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
