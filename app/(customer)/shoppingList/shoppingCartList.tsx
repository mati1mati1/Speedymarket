import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Modal, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { createShoppingList, getShoppingListsByBuyerId, deleteShoppingList, uploadGroceryListImage, uploadRecipeUrl } from '../../../src/api/api';
import { ShoppingList } from '../../../src/models';
import { useAuth } from 'src/context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

const ShoppingCartListScreen = () => {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState('');
  const { authState } = useAuth();  
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

  const handleUploadImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri as string };
        setImage(source);
        try {
          const res = await uploadGroceryListImage(source.uri);
          if (res.success) {
            const items = res.list;
            setListItems(items);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Please try again with a different image',
            });
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Please try again later, we had a problem',
          });
        }
      }
    });
  };

  const handleRecipe = async () => {
    const res = await uploadRecipeUrl(recipeUrl);
    if (res.success) {
      setListItems(res.list);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please try again with a different URL',
      });
    }
    setRecipeUrl('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
              <Text style={styles.buttonText}>Delete</Text>
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
              <Text style={styles.modalTitle}>Add a New Shopping List</Text>
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
              <View style={[styles.inputContainer, styles.borderBottom]}>
                <TextInput
                  style={styles.input}
                  placeholder="Add new item"
                  value={newItem}
                  onChangeText={setNewItem}
                />
                <Pressable onPress={() => {
                  if (newItem.trim()) {
                    setListItems([...listItems, newItem.trim()]);
                    setNewItem('');
                  }
                }}>
                  <Text>Add</Text>
                </Pressable>
              </View>
              <Text style={styles.modalTitle}>Add a list from an image:</Text>
              <Pressable style={styles.bigButton} onPress={handleUploadImage}>
                <Text style={styles.buttonText}>Upload Image</Text>
              </Pressable>
              <View style={styles.borderBottom}></View>
              <View style={styles.modalButtons}>
                <Text style={styles.modalTitle}>Add a list from a recipe URL:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Recipe URL"
                  value={recipeUrl}
                  onChangeText={setRecipeUrl}
                />
              </View>
              <TouchableOpacity style={styles.bigButton} onPress={handleRecipe}>
                <Text style={styles.buttonText}>Get Grocery Ingredients</Text>
              </TouchableOpacity>
              <View style={styles.borderBottom}></View>
              {image && <Image source={image} style={styles.image} />}

              {listItems.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.listTitle}>Your Items:</Text>
                  {listItems.map((item, index) => (
                    <Text key={index} style={styles.listItem}>{item}</Text>
                  ))}
                </View>
              )}

              <View style={styles.modalButtons}>
              
                <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
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
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text>Are you sure you want to delete this shopping list?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteCart}>
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsConfirmModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
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
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
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
    width: '100%',
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
  cancelButton: {
    backgroundColor: '#ccc',
    marginLeft: 5,
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
