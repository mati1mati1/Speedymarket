import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, ScrollView } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { BarCodeScanningResult } from 'expo-camera/build/legacy/Camera.types';
import customAlert from './AlertComponent';

interface ScanItemProps {
  handleData: (data: string) => void;
  closeMe: () => void;
}

const ScanMobileItem: React.FC<ScanItemProps> = ({ handleData, closeMe }) => {
  const [status, setStatus] = useState<null | string>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!scanned) {
      // customAlert('Barcode detected', `Barcode data: ${data}`);
      setScanned(true);
      setLoading(true);
      handleData(data); // Send data to parent
      closeMe(); // Close modal
      setLoading(false);
      setCameraVisible(false); // Hide camera after scanning
      // setTimeout(() => {
        setScanned(false); // Allow a new scan
        
      // }, 5000); // Adjust timing as needed

    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.statusText}>Scan Barcode{status}</Text>
      {cameraVisible && (
        <CameraView
          style={{ height: "200%", width: 500 }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Disable scanning if already scanned
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code93", "code128", "codabar"],
          }}
        />
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
