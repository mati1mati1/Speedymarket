import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

export default function NativeMapView() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map} // Ensure the map occupies the entire container
        initialRegion={{
          latitude: 37.78825, // Example coordinates
          longitude: -122.4324,
          latitudeDelta: 0.0922, // Zoom level
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
