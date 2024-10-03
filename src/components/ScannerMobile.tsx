import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, ScrollView } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { BarCodeScanningResult } from 'expo-camera/build/legacy/Camera.types';

interface ScanItemProps {
  handleData: (data: string) => void;
  closeMe: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScanMobileItem: React.FC<ScanItemProps> = ({ handleData, closeMe }) => {
  const [status, setStatus] = useState<null | string>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [superMarket, setSuperMarket] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
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
        <Button onPress={() => Camera.requestCameraPermissionsAsync()} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: BarCodeScanningResult) => {
    setScanned(true);
    setLoading(true);
    console.log(`barcode detected: ${data}`);
    handleData(data);
    closeMe(false);
    setLoading(false);
    setCameraVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.statusText}>Scan Barcode{status}</Text>
        {/* <View style={styles.buttonContainer}>
          <RNEButton
            title=" Scan Barcode"
            icon={
              <MaterialIcon
                name="barcode-scan"
                size={20}
                color="white"
              />
            }
            buttonStyle={styles.blueButton}
            onPress={() => { setScanned(false); setCameraVisible(true); }} 
            disabled={loading}        
          />
        </View> */}
      {cameraVisible && !scanned && (
        <CameraView
          style={[{ height: "200%", width: 500}]}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr","ean13","ean8","upc_a","upc_e","code39","code93","code128","codabar"],
          }}
        />
      )}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {scanned && (
        <>
        <Text style={styles.message}>Barcode scanned</Text>
        <Text style={styles.message}>Supermarket: {superMarket}</Text>
        </>)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    width: '100%',
    height: '10%',
    maxHeight: '50%',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    width: '80%',
    fontWeight: 'bold',
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

export default ScanMobileItem;
