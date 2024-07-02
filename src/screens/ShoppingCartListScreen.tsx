import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';

type ShoppingCartListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShoppingCartList'>;

const shoppingCarts = [
  { id: '1', name: 'Cart 1' },
  { id: '2', name: 'Cart 2' },
  { id: '3', name: 'Cart 3' },
];

const ShoppingCartListScreen = () => {
  const navigation = useNavigation<ShoppingCartListScreenNavigationProp>();

  const handleAddCart = () => {
    const newCartId = (shoppingCarts.length + 1).toString();
    shoppingCarts.push({ id: newCartId, name: `Cart ${newCartId}` });
    navigation.navigate('ShoppingList', { cartId: newCartId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Carts</Text>
      <FlatList
        data={shoppingCarts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ShoppingList', { cartId: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Shopping Cart" onPress={handleAddCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default ShoppingCartListScreen;
