import React from 'react';
import { Platform, View } from 'react-native';
import MapView from 'react-native-maps';


const SupermarketMapsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={Platform.OS === 'web' ? "google" : undefined}
        // googleMapsApiKey={Platform.OS === 'web' ? "AIzaSyBm87RjlxBzgHDCdoiREMJJkLgXzRX-w9Q" : undefined}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default SupermarketMapsScreen;
