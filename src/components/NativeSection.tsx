import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionProps {
  id: number;
  name: string;
  left: number;
  top: number;
  rotation: number;
  style?: any;
}

const NativeSection: React.FC<SectionProps> = ({ id, name, left, top, rotation, style }) => {
  return (
    <View
      style={[
        styles.section,
        {
          left: left,
          top: top,
          transform: [{ rotate: `${rotation}deg` }],
        },
        style
      ]}
    >
      <Text style={[styles.sectionText, { transform: [{ rotate: `-${rotation}deg` }] }]}>
        {name} {id}
      </Text>

      <View style={styles.arrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    position: 'absolute',
    width: 80,
    height: 40,
    backgroundColor: '#007bff', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0056b3',
  },
  sectionText: {
    color: 'white',
    fontSize: 10,
  },
  arrow: {
    position: 'absolute',
    bottom: -10, 
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: 'green', 
  },
});

export default NativeSection;
