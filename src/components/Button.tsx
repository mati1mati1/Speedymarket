import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { commonStyles } from '../styles/styles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, color = '#007bff' }) => {
  return (
    <Pressable style={[commonStyles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={commonStyles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export default Button;
