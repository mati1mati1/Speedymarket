import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Button, Platform } from 'react-native';
import { Camera, useCameraDevice, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';

const BarcodeScannerComponent: React.FC<{ onBarCodeScanned: (data: string) => void }> = ({ onBarCodeScanned }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<Camera>(null);

  const devices = useCameraDevices();
  const device = useCameraDevice('back');

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE, BarcodeFormat.PDF417]);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    };

    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0 && !scanned) {
      const barcode = barcodes[0].displayValue || barcodes[0].content.data;
      setScanned(true);
      onBarCodeScanned(barcode.toString());
      alert(`Barcode scanned! Data: ${barcode}`);
    }
  }, [barcodes, scanned]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {device != null && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={!scanned}
        />
      )}
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BarcodeScannerComponent;
