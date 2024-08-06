import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

const WebSection: React.FC<SectionProps> = ({ id, x, y, rotation }) => {
  return (
    <View
      style={[
        styles.section,
        {
          transform: [{ rotate: `${rotation}deg` }],
          left: x,
          top: y
        }
      ]}
    >
      <Text style={styles.text}>{id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    position: 'absolute',
    width: 80,
    height: 40,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black'
  },
  text: {
    fontSize: 10
  }
});

export default WebSection;
