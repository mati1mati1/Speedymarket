import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { commonStyles } from '../styles/styles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, color = '#007bff' }) => {
  return (
    <TouchableOpacity style={[commonStyles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={commonStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default Button;
