import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { ShopInventory } from '../models';

export default function InventoryManagementScreen() {
  const [inventory, setInventory] = useState<ShopInventory[]>([]);
  const [currentItem, setCurrentItem] = useState<ShopInventory | null>(null);
  const [form, setForm] = useState({ ItemNumber: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });

  useEffect(() => {
    const shopInventory = JSON.parse(sessionStorage.getItem('ShopInventory') || '[]');
    setInventory(shopInventory);
  }, []);

  const handleFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleAddItem = () => {
    const newItem: ShopInventory = {
      InventoryID: Math.random().toString(),
      ItemNumber: form.ItemNumber,
      Quantity: parseInt(form.Quantity),
      Price: parseFloat(form.Price),
      Discount: parseFloat(form.Discount),
      Location: form.Location,
      Barcode: form.Barcode,
      SupermarketID: '' // Assuming SupermarketID will be managed elsewhere
    };

    setInventory([...inventory, newItem]);
    sessionStorage.setItem('ShopInventory', JSON.stringify([...inventory, newItem]));
    setForm({ ItemNumber: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
  };

  const handleEditItem = () => {
    if (currentItem) {
      const updatedInventory = inventory.map(item => 
        item.InventoryID === currentItem.InventoryID 
          ? { ...item, ...form, Quantity: parseInt(form.Quantity), Price: parseFloat(form.Price), Discount: parseFloat(form.Discount) } 
          : item
      );

      setInventory(updatedInventory);
      sessionStorage.setItem('ShopInventory', JSON.stringify(updatedInventory));
      setCurrentItem(null);
      setForm({ ItemNumber: '', Quantity: '', Price: '', Discount: '', Location: '', Barcode: '' });
    }
  };

  const handleEditClick = (item: ShopInventory) => {
    setCurrentItem(item);
    setForm({ 
      ItemNumber: item.ItemNumber, 
      Quantity: item.Quantity.toString(), 
      Price: item.Price.toString(), 
      Discount: item.Discount.toString(), 
      Location: item.Location, 
      Barcode: item.Barcode 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>

      <View style={styles.form}>
        <TextInput 
          placeholder="Item Number" 
          value={form.ItemNumber} 
          onChangeText={(value) => handleFormChange('ItemNumber', value)} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Quantity" 
          value={form.Quantity} 
          onChangeText={(value) => handleFormChange('Quantity', value)} 
          style={styles.input} 
          keyboardType="numeric" 
        />
        <TextInput 
          placeholder="Price" 
          value={form.Price} 
          onChangeText={(value) => handleFormChange('Price', value)} 
          style={styles.input} 
          keyboardType="numeric" 
        />
        <TextInput 
          placeholder="Discount" 
          value={form.Discount} 
          onChangeText={(value) => handleFormChange('Discount', value)} 
          style={styles.input} 
          keyboardType="numeric" 
        />
        <TextInput 
          placeholder="Location" 
          value={form.Location} 
          onChangeText={(value) => handleFormChange('Location', value)} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="Barcode" 
          value={form.Barcode} 
          onChangeText={(value) => handleFormChange('Barcode', value)} 
          style={styles.input} 
        />

        <Button 
          title={currentItem ? "Update Item" : "Add Item"} 
          onPress={currentItem ? handleEditItem : handleAddItem} 
        />
      </View>

      <FlatList
        data={inventory}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEditClick(item)}>
            <Text style={styles.item}>
              {item.ItemNumber} - Quantity: {item.Quantity} - Price: {item.Price} - Discount: {item.Discount} - Location: {item.Location} - Barcode: {item.Barcode}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.InventoryID ? item.InventoryID.toString() : Math.random().toString()} // Use a fallback key if InventoryID is undefined
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});
