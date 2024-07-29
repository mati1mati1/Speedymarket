import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getItemBySupermarketIdAndBarcode } from '../api/api';
import { ShopInventory } from 'src/models';

interface ScanItemProps {
  handleData: (data: any) => void;
  supermarketId: string;
}

const ScanItem: React.FC<ScanItemProps> = ({ handleData, supermarketId }) => {
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Pressable onPress={() => BarCodeScanner.requestPermissionsAsync()}>
          <Text>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    console.log(`barcode detected: ${data}`);
    try {
      const response: ShopInventory[] = await getItemBySupermarketIdAndBarcode(supermarketId, data);
      console.log(response);
      if (response?.length > 0) {
        console.log('Item found');
        handleData(response[0]);
      } else {
        console.log('Item not found');
        handleData(null);
      }
    } catch (error) {
      console.error('Invalid QR code data:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Scan Barcode" onPress={() => { setScanned(false); setCameraVisible(true); }} disabled={loading} />
      </View>
      {cameraVisible && !scanned && (
        <View>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Button title="Back" onPress={() => setCameraVisible(false)} />
        </View>
      )}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    width: '80%',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
  },
  buttonWrapper: {
    marginVertical: 10,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    margin: 10,
  },
});

export default ScanItem;