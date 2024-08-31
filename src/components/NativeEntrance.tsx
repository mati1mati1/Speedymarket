import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EntranceProps {
  left: number;
  top: number;
}

const NativeEntrance: React.FC<EntranceProps> = ({ left, top }) => {
  return (
    <View
      style={[
        styles.entrance,
        {
          left: left,
          top: top,
        }
      ]}
    >
      <Text style={styles.entranceText}>כניסה</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  entrance: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#004d00',
  },
  entranceText: {
    color: 'white',
    fontSize: 14,
  },
});

export default NativeEntrance;
