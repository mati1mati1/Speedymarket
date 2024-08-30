// import React from 'react';
// import { Platform, View, ViewProps, StyleSheet } from 'react-native';
// // Web MapView component
// const WebMapView = require('@teovilla/react-native-web-maps').default;

// // Native MapView component
// const NativeMapView = require('react-native-maps').default;



// export default function (props) {
//   if (Platform.OS === 'web') {
//     return <WebMapView 
//       provider="google"
//       googleMapsApiKey="AIzaSyBm87RjlxBzgHDCdoiREMJJkLgXzRX-w9Q"
//     />;
//   } else {
//     return (
//       <View style={styles.container}>
//         <NativeMapView
//           style={styles.map} // Ensure the map occupies the entire container
//           initialRegion={{
//             latitude: 37.78825, // Example coordinates
//             longitude: -122.4324,
//             latitudeDelta: 0.0922, // Zoom level
//             longitudeDelta: 0.0421,
//           }}
//         />
//       </View>
//     );
//   }};
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     map: {
//       width: '100%',
//       height: '100%',
//     },
//   });
  

