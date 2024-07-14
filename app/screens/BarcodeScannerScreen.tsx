import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function BarcodeScannerScreen() {
  const [barcode, setBarcode] = useState('');

  const handleScan = () => {
    console.log('Barcode scanned:', barcode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Scanner</Text>
      <TextInput
        style={styles.input}
        value={barcode}
        onChangeText={setBarcode}
        placeholder="Scan barcode here"
      />
      <Button title="Scan" onPress={handleScan} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
