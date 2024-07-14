import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';

type StartShoppingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartShopping'>;

const StartShoppingScreen = () => {
  const navigation = useNavigation<StartShoppingScreenNavigationProp>();

  const handleSelectList = () => {
    navigation.navigate('SelectList'); // Navigate to SelectListScreen
  };

  const handleStartWithoutList = () => {
    // Navigate to the supermarket selection screen or any other screen as required
    navigation.navigate('SupermarketMap', { listId: '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Shopping</Text>
      <Button title="Select List" onPress={handleSelectList} />
      <Button title="Start Without List" onPress={handleStartWithoutList} />
    </View>
  );
};

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
  },
  button: {
    marginVertical: 10,
  },
});

export default StartShoppingScreen;
