// import WifiManager from 'react-native-wifi-reborn';
// import { Platform, PermissionsAndroid } from 'react-native';

// export const connectToWifi = async (ssid: string, password: string): Promise<void> => {
//   if (Platform.OS === 'android') {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: 'Location permission is required for WiFi connections',
//         message: 'This app needs location permission as this is required to connect to WiFi networks.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );

//     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//       throw new Error('Location permission denied');
//     }
//   }

//   try {
//     await WifiManager.connectToProtectedSSID(ssid, password, false, false);
//     console.log(`Connected to ${ssid}`);
//   } catch (error) {
//     console.error('Failed to connect to WiFi', error);
//     throw new Error('Failed to connect to WiFi');
//   }
// };