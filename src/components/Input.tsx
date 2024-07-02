import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { commonStyles } from '../styles/styles';

const Input: React.FC<TextInputProps> = (props) => {
  return <TextInput style={commonStyles.input} {...props} />;
}

export default Input;
