// import React, { useState, useEffect } from 'react';
// import { Text, View, Button } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { getItemBySupermarketIdAndBarcode } from '../api/api';
// import { ShopInventory } from '../models';

// interface CustomerBarcodeScannerProps {
//   supermarketId: string;
// }

// const CustomerBarcodeScanner: React.FC<CustomerBarcodeScannerProps> = ({ supermarketId }) => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState(false);
//   const [item, setItem] = useState<ShopInventory | null>(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
//     setScanned(true);
//     try {
//       const items = await getItemBySupermarketIdAndBarcode(supermarketId, data);
//       setItem(items[0]);
//     } catch (error) {
//       console.error('Error fetching item:', error);
//       alert('Error fetching item');
//     }
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={{ height: 300, width: 300 }}
//       />
//       {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
//       {item && (
//         <View style={{ marginTop: 20 }}>
//           <Text>Item: {item.ItemName}</Text>
//           <Text>Price: {item.Price}</Text>
//           <Text>Quantity: {item.Quantity}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default CustomerBarcodeScanner;
