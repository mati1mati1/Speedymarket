import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionProps {
  id: number;
  left: number;
  top: number;
  rotation: number;
}

const WebSection: React.FC<SectionProps> = ({ id, left, top, rotation }) => {
  return (
    <View
      style={[
        styles.section,
        {
          transform: [{ rotate: `${rotation}deg` }],
          left,
          top
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
