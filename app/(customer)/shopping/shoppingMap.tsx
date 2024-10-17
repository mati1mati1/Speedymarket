import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform, ScrollView, Animated, Alert } from 'react-native';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Toast from 'react-native-toast-message'; 
import WebShoppingMap from '../../../src/components/WebShoppingMap';
import { useLocalSearchParams } from 'expo-router';
import { EntranceType, loadMapAndPath, SectionType, ItemWithLocation } from '../../../src/services/mapService';
import { getItemBySupermarketIdAndBarcode, getItemBySupermarketIdAndItemName } from '../../../src/api/api';
import { ShopInventory, ShoppingListItem } from '../../../src/models';
import MissingItemsModal from '../../../src/components/MissingItemsModal';
import FoundItemsModal from '../../../src/components/FoundItemsModal';
import ShoppingCart from '../../../src/components/ShoppingCart';
import ScanMobileItem from '../../../src/components/ScannerMobile';
import QuantityModal from '../../../src/components/QuantityModal'; 
import Payment from '../../../src/components/Payment';
import customAlert from '../../../src/components/AlertComponent';
import NativeShoppingMap from '../../../src/components/NativeShoppingMap'; 
import * as signalR from '@microsoft/signalr';
const isWeb = Platform.OS === 'web'
const Map = isWeb ? WebShoppingMap : NativeShoppingMap;

const ShoppingMap: React.FC = () => {
  const { supermarketId, listId } = useLocalSearchParams<{ supermarketId: string; listId?: string }>();
  const [sections, setSections] = useState<SectionType[]>([]);
  const [entrance, setEntrance] = useState<EntranceType | null>(null);
  const [path, setPath] = useState<number[][]>([]);
  const [currentOffset, setCurrentOffset] = useState<{ x: number; y: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [itemFoundList, setItemFoundList] = useState<ItemWithLocation[]>([]);
  const [missingItemList, setItemMissingList] = useState<ShoppingListItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [shoppingCart, setShoppingCart] = useState<ShopInventory[]>([]);
  const [isFoundItemsModalOpen, setIsFoundItemsModalOpen] = useState(false);
  const [isScannedDataOpen, setScannedDataModalOpen] = useState(false);
  const [isMissingItemsModalOpen, setIsMissingItemsModalOpen] = useState(false);
  const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isPaymentState, setIsPaymentState] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false); 
  const [selectedItem, setSelectedItem] = useState<ShopInventory | null>(null); 


  useEffect(() => {
    async function connectSignalR(supermarketId) {
      try {
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl("https://speedymarketbackend1.azurewebsites.net/api", {
            withCredentials: true,
          })
          .configureLogging(signalR.LogLevel.Information)
          .withAutomaticReconnect()
          .build();
    
        if (supermarketId) {
          hubConnection.on(supermarketId, (items) => {
            if (!isPaymentState && Array.isArray(items)) {
              items.forEach(item => {
                if (itemFoundList.some(foundItem => foundItem.ItemName === item.itemName)) {
                  console.log("Received item:", item);
                  customAlert('Item Out of Stock', `Item: "${item.itemName}" is out of stock in supermarket.`, [{ text: 'OK' }]); 
                }
              });
            }
          });
        } else {
          console.error("supermarketId is undefined or invalid.");
        }
    
        await hubConnection.start();
        console.log("SignalR connected successfully.");
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    }
    

    connectSignalR(supermarketId);
  }, []);
  const addItemThatNotHaveEnoughStock = (items: ItemWithLocation[]) => {
    items.forEach(item => {
      if (item.quantityInStore < item.Quantity) {
        setItemMissingList(prev => [
          ...prev,
          {
            ItemName: item.ItemName,
            Quantity: item.Quantity - item.quantityInStore, 
            ListItemID: item.ListItemID,
            ListID: item.ListID,
            ItemID: '' , 
          },
        ]);
      }
    });
  };

  useEffect(() => {
    const fetchMapAndPath = async () => {
      try {
        const data = await loadMapAndPath(supermarketId || '', listId || '');
        setSections(data.map.sections || []);
        setEntrance(data.map.entrance || null);
        setPath(data.path || []);
        setItemFoundList(data.itemsWithLocations || []);
        setItemMissingList(data.missingItems || []);
        addItemThatNotHaveEnoughStock(data.itemsWithLocations);
        if(data.missingItems?.length > 0){
          const initialCheckedItems = data.itemsWithLocations.reduce((acc: { [key: string]: boolean }, item: ItemWithLocation) => {
            acc[item.ListItemID] = false;
            return acc;
          }, {});
          setCheckedItems(initialCheckedItems);
        }
      } catch (error: any) {
        customAlert(error.message, 'There was an error fetching the map and path. Please try again.', [{ text: 'OK' }]);
      }
    };

    fetchMapAndPath();
  }, [supermarketId, listId]);

  const handleCheckboxChange = (itemId: string) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [itemId]: !prevCheckedItems[itemId],
    }));
  };

  
  const handleScannedData = async (data: string) => {
    setScannedData(data);
    try {
      const item: ShopInventory[] = await getItemBySupermarketIdAndBarcode(supermarketId || '', data);
      if (item.length > 0 && item[0].Quantity > 0) {
        setSelectedItem(item[0]); 
        setIsQuantityModalVisible(true);
      } else {
        customAlert('Item Not Found', 'The scanned item was not found in this store, go to cashier.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      customAlert('Error', 'There was an error fetching the item. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleAddToCart = (quantity: number) => {
    if (selectedItem) {
      setShoppingCart((prevCart) => updateCart(prevCart, selectedItem, quantity));
      setSelectedItem(null);
      setIsQuantityModalVisible(false);
    } else {
      customAlert('Item Not Found', 'No item in the supermarket.', [{ text: 'OK' }]);
    }
  };

  const handleAddItemToCart = async (itemName: string, quantity: number) => {
    if (itemName) {
      try {
        const item: ShopInventory[] = await getItemBySupermarketIdAndItemName(supermarketId || '', itemName);
        if (item.length > 0) {
          const selectedItem = item[0];
          setShoppingCart((prevCart) => updateCart(prevCart, selectedItem, quantity));
          setIsQuantityModalVisible(false);
        } else {
          customAlert('Item Not Found', 'No item in the supermarket.', [{ text: 'OK' }]);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        customAlert('Error', 'There was an error fetching the item. Please try again.', [{ text: 'OK' }]);
      }
    }
  };

  const handleUpdateCart = (updatedCart: ShopInventory[]) => {
    setShoppingCart(updatedCart);
  };

  const updateCart = (cart: ShopInventory[], newItem: ShopInventory, quantity: number): ShopInventory[] => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.ItemName === newItem.ItemName);
    let totalQuantity = quantity;

    if (existingItemIndex !== -1) {
      const existingItem = cart[existingItemIndex];
      totalQuantity += existingItem.Quantity;
    }

    if (totalQuantity > newItem.Quantity) {
      customAlert('Not enough stock', 'Not enough stock in the supermarket.', [{ text: 'OK' }]);
      return cart;
    }

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].Quantity = totalQuantity;
      return updatedCart;
    }
    newItem.Quantity = totalQuantity;
    return [...cart, newItem];
  };

  const toggleFoundItemsModal = () => {
    setIsFoundItemsModalOpen(!isFoundItemsModalOpen);
  };

  const toggleIsScannedDataOpen = () => {
    setScannedDataModalOpen(!isScannedDataOpen);
  };

  const toggleMissingItemsModal = () => {
    setIsMissingItemsModalOpen(!isMissingItemsModalOpen);
  };

  const toggleShoppingCart = () => {
    setIsShoppingCartOpen(!isShoppingCartOpen);
  };

  const togglePayment = () => {
    setIsPaymentState(!isPaymentState);
  };

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  
  const drawUserLocation = () => (
    userLocation && (
      <View
        style={{
          position: 'absolute',
          left: userLocation.x,
          top: userLocation.y,
          width: 10,
          height: 10,
          backgroundColor: 'blue',
          borderRadius: 5,
        }}
      />
    )
  );


  return (
    <DndProvider backend={HTML5Backend}>
      <View style={styles.viewerContainer}>
        <TouchableOpacity style={styles.menuToggle} onPress={toggleMenu}>
          <Text style={styles.menuToggleText}>{menuCollapsed ? 'Show Menu' : 'Hide Menu'}</Text>
        </TouchableOpacity>
        {!menuCollapsed && (
          <View style={styles.collapsedMenu}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFoundItemsModal}>
              <Text style={styles.actionButtonText}>Show Found Items</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleMissingItemsModal}>
              <Text style={styles.actionButtonText}>Show Missing Items</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleShoppingCart}>
              <Text style={styles.actionButtonText}>Show Shopping Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={togglePayment}>
              <Text style={styles.actionButtonText}>Pay now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleIsScannedDataOpen}>
              <Text style={styles.actionButtonText}>Scan Item</Text>
            </TouchableOpacity>
          </View>
        )}
       <Map sections={sections} entrance={entrance} path={path} itemFoundList={itemFoundList} />
        <Modal visible={isScannedDataOpen} transparent={true} onRequestClose={toggleIsScannedDataOpen}>
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleIsScannedDataOpen}>
            <View style={[styles.modal, {height: '40%'}]} onStartShouldSetResponder={() => true}>
              <ScanMobileItem handleData={handleScannedData} closeMe={toggleIsScannedDataOpen}/>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={isFoundItemsModalOpen} transparent={true} onRequestClose={toggleFoundItemsModal}>
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleFoundItemsModal}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <FoundItemsModal
                isOpen={isFoundItemsModalOpen}
                onRequestClose={toggleFoundItemsModal}
                items={itemFoundList}
                checkedItems={checkedItems}
                onCheckboxChange={handleCheckboxChange}
                addToCart={handleAddItemToCart}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={isMissingItemsModalOpen} transparent={true} onRequestClose={toggleMissingItemsModal}>
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleMissingItemsModal}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <MissingItemsModal
                isOpen={isMissingItemsModalOpen}
                onRequestClose={toggleMissingItemsModal}
                items={missingItemList}
                shoppingCart={shoppingCart}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={isShoppingCartOpen} transparent={true} onRequestClose={toggleShoppingCart}>
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleShoppingCart}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <ShoppingCart
                isOpen={isShoppingCartOpen}
                onRequestClose={toggleShoppingCart}
                itemInCard={shoppingCart}
                onUpdateCart={handleUpdateCart}/>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={isPaymentState} transparent={true} onRequestClose={togglePayment}>
          <TouchableOpacity style={styles.modalOverlay} onPress={togglePayment}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <Payment 
              items={shoppingCart}
              isOpen={isPaymentState}
              onRequestClose={togglePayment}
              supermarketId={supermarketId}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        
        <QuantityModal
          visible={isQuantityModalVisible}
          onClose={() => setIsQuantityModalVisible(false)}
          onAddToCart={handleAddToCart}
        />
      </View>
    </DndProvider>
  );
};

export default ShoppingMap;

const styles = StyleSheet.create({
  viewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapEditor: {
    borderWidth: 1,
    borderColor: 'black',
  },
  menuToggle: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  menuToggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  collapsedMenu: {
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  actionButton: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});
