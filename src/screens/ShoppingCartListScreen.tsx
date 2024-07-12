import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';

type ShoppingCartListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShoppingCartList'>;

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
}

interface ShoppingList {
  ListID: string;
  ListName: string;
  BuyerID: string;
  Items: string; // This will be JSON string
}

const ShoppingCartListScreen = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const navigation = useNavigation<ShoppingCartListScreenNavigationProp>();

  useEffect(() => {
    debugger
    const storedShoppingLists = sessionStorage.getItem('ShoppingLists');
    if (storedShoppingLists) {
      const parsedShoppingLists: ShoppingList[] = JSON.parse(storedShoppingLists);
      setShoppingLists(parsedShoppingLists);
    }
  }, []);

  const handleAddCart = () => {
    // Implement the logic to add a new cart
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart Lists</Text>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ShoppingList', { cartId: item.ListID })}
          >
            <Text>{item.ListName}</Text>
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
