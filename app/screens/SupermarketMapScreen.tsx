import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SupermarketMapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supermarket Map</Text>
      <Text>Map will be displayed here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SupermarketMapScreen;
