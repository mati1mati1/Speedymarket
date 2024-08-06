import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EntranceProps {
  x: number;
  y: number;
}

const WebEntrance: React.FC<EntranceProps> = ({ x, y }) => {
  return (
    <View
      style={[
        styles.entrance,
        {
          left: x,
          top: y
        }
      ]}
    >
      <Text style={styles.text}>כניסה</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  entrance: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black'
  },
  text: {
    fontSize: 16
  }
});

export default WebEntrance;
