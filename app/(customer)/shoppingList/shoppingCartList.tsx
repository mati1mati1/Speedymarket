import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Modal, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { createShoppingList, getShoppingListsByBuyerId, deleteShoppingList, uploadGroceryListImage, uploadRecipeUrl } from '../../../src/api/api';
import { ShoppingList } from '../../../src/models';
import { useAuth } from 'src/context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWindowDimensions } from 'react-native';
import { Platform } from 'react-native';

const ShoppingCartListScreen = () => {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState('');
  const { authState } = useAuth();
  const token = authState.token;
  const { width } = useWindowDimensions(); // Get the window width
  const isWeb = Platform.OS === 'web' && width > 600;
  const [listItems, setListItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [recipeUrl, setRecipeUrl] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedShoppingLists = await getShoppingListsByBuyerId();
        if (storedShoppingLists) {
          setShoppingLists(storedShoppingLists);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCart = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewListName('');
  };

  const handleAdd = async () => {
    if (shoppingLists.some(list => list.ListName === newListName)) {
      alert('A shopping list with this name already exists.');
      return;
    }
    setIsModalVisible(false);
    try {
      const response = await createShoppingList(newListName);
      setShoppingLists(prevLists => [...prevLists, response[0]]);
      setNewListName('');
      router.push({
        pathname: '/shoppingList/[listId]',
        params: { 'listId': response[0].ListID, ListName: newListName }
      });
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }
  };

  const handleEditCart = (cartId: string, listName: string) => {
    router.push({
      pathname: '/shoppingList/[listId]',
      params: { 'listId': cartId, ListName: listName }
    });
  };

  const confirmDeleteCart = (cartId: string) => {
    setSelectedCartId(cartId);
    setIsConfirmModalVisible(true);
  };

  const handleDeleteCart = async () => {
    setIsConfirmModalVisible(false);
    try {
      await deleteShoppingList(selectedCartId);
      setShoppingLists(prevLists => prevLists.filter(list => list.ListID !== selectedCartId));
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold', alignSelf: 'center'}}>My Shopping Lists</Text>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.ListID}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Pressable
              style={styles.item}
              onPress={() => handleEditCart(item.ListID, item.ListName)}
            >
              <Text>{item.ListName}</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => confirmDeleteCart(item.ListID)}>
              <Icon name="trash" size={24} color="#FF6347" />
            </Pressable>
          </View>
        )}
      />
      <Pressable style={styles.button} onPress={handleAddCart}>
        <Text style={styles.buttonText}>+ New List</Text>
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
            <View style={styles.top}>
              <Text style={styles.modalTitle}>Add a New Shopping List</Text>
              <Pressable onPress={handleCancel}>
                  <Icon name="close" size={24} color="#007bff" />
              </Pressable>
            </View>
              <View style={[styles.modalButtons]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter list name"
                  value={newListName}
                  onChangeText={setNewListName}
                />
                <Pressable style={[styles.modalButton, styles.addButton]} onPress={handleAdd}>
                  <Text style={styles.buttonText}>Add</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        onRequestClose={() => setIsConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer,styles.modalDeleteList]}>
            <View style={styles.top}>
            <Text style={styles.modalTitle}>Are you sure you want to delete this shopping list?</Text>
            <Pressable onPress={() => setIsConfirmModalVisible(false)}>
                <Icon name="close" size={24} color="#007bff" />
            </Pressable>
            </View>
              <Pressable style={[styles.modalButton, styles.deleteButton, styles.deleteButtonNoIcon]} onPress={handleDeleteCart}>
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  item: {
    flex: 1,
  },
  bigButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonNoIcon: {
    backgroundColor: 'red',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: Platform.OS === 'web'? '30%': '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalDeleteList: {
    width: Platform.OS === 'web'? '35%': '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '70%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  borderBottom : {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    height: 40,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    marginRight: 5,
    width: '30%',
    maxWidth: '30%'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },

});

export default ShoppingCartListScreen;
