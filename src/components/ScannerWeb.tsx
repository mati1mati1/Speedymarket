import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Button } from 'react-native';
import { Scanner } from '@yudiel/react-qr-scanner';

interface ScanItemProps {
  handleData: (data: string) => void;
  closeMe: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScanWebItem: React.FC<ScanItemProps> = ({ handleData, closeMe }) => {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [data, setData] = useState<string | null>(null);

  const handleBarCodeScanned = (err: any, result: any) => {
    if (err) {
      console.error(err); // Handle error appropriately
      return;
    }

    if (result) {
      setLoading(true);
      setScanned(true);
      setData(result[0].rawValue); // Update data with scanned result
    //   console.log(`Barcode detected: ${result[0].rawValue}`);
      handleData(result[0].rawValue);
      closeMe(false);
      setLoading(false);
      setCameraVisible(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.statusText}>Scan Barcode</Text>

      {cameraVisible && !scanned && (
        <Scanner
          // You can set width and height according to your layout
          onScan={(result)=> handleBarCodeScanned(null, result)}
          onError={(err) => handleBarCodeScanned(err, null)}
          formats={[
            'aztec',
            'code_128',
            'code_39',
            'code_93',
            'codabar',
            'databar',
            'databar_expanded',
            'data_matrix',
            'dx_film_edge',
            'ean_13',
            'ean_8',
            'itf',
            'maxi_code',
            'micro_qr_code',
            'pdf417',
            'qr_code',
            'rm_qr_code',
            'upc_a',
            'upc_e',
            'linear_codes',
            'matrix_codes',
            'unknown'
        ]}
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
          <Text style={styles.message}>Data: {data}</Text>
        </>
      )}

      <Button
        title="Scan Again"
        onPress={() => {
          setScanned(false);
          setCameraVisible(true); // Show camera again for new scan
        }}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    width: '100%',
    // Adjust height according to your needs
    maxHeight: '50%', // Optional: adjust based on your needs
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

export default ScanWebItem;
