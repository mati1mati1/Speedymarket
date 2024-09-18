import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform, ScrollView, Animated, Alert } from 'react-native';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WebSection from '../../../src/components/WebSection';
import WebEntrance from '../../../src/components/WebEntrance';
import NativeSection from '../../../src/components/NativeSection';
import NativeEntrance from '../../../src/components/NativeEntrance';
import Svg, { Line, Defs, Marker, Path, Circle } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import { EntranceType, loadMapAndPath, SectionType, ItemWithLocation } from '../../../src/services/mapService';
import { getItemBySupermarketIdAndBarcode, getItemBySupermarketIdAndItemName } from '../../../src/api/api';
import { ShopInventory, ShoppingListItem } from '../../../src/models';
import MissingItemsModal from '../../../src/components/MissingItemsModal';
import FoundItemsModal from '../../../src/components/FoundItemsModal';
import ShoppingCart from '../../../src/components/ShoppingCart';
import ScanItem from '../../../src/components/Scanner';
import QuantityModal from '../../../src/components/QuantityModal'; 
import Payment from '../../../src/components/Payment';

const Entrance = Platform.OS === 'web' ? WebEntrance : NativeEntrance;
const Section = Platform.OS === 'web' ? WebSection : NativeSection;

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
  const [isPaymentState, setIsPaymentState] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(new Animated.Value(1));
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false); 
  const [selectedItem, setSelectedItem] = useState<ShopInventory | null>(null); 
  const mapWidth = 800;
  const mapHeight = 600;

  useEffect(() => {
    const fetchMapAndPath = async () => {
      try {
        const data = await loadMapAndPath(supermarketId || '', listId || '');
        setSections(data.map.sections || []);
        setEntrance(data.map.entrance || null);
        setPath(data.path || []);
        setItemFoundList(data.itemsWithLocations || []);
        setItemMissingList(data.missingItems || []);
        if(data.missingItems?.length > 0){
          const initialCheckedItems = data.itemsWithLocations.reduce((acc: { [key: string]: boolean }, item: ItemWithLocation) => {
            acc[item.ListItemID] = false;
            return acc;
          }, {});
          setCheckedItems(initialCheckedItems);
        }
      } catch (error: any) {
        alert(error.message);
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
        Alert.alert('Item Not Found', 'The scanned item was not found in the database.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      Alert.alert('Error', 'There was an error fetching the item. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleAddToCart = (quantity: number) => {
    if (selectedItem) {
      setShoppingCart((prevCart) => updateCart(prevCart, selectedItem, quantity));
      setSelectedItem(null);
      setIsQuantityModalVisible(false);
    } else {
      Alert.alert('Item Not Found', 'No item in the supermarket.', [{ text: 'OK' }]);
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
          Alert.alert('Item Not Found', 'No item in the supermarket.', [{ text: 'OK' }]);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        Alert.alert('Error', 'There was an error fetching the item. Please try again.', [{ text: 'OK' }]);
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
      Alert.alert('Not enough stock', 'Not enough stock in the supermarket.', [{ text: 'OK' }]);
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

  const drawPath = () => {
    if (!path || path.length === 0) return null;

    // Map grid coordinates to screen coordinates
    const mapToScreenCoordinates = (gridPoint: number[], gridWidth: number, gridHeight: number, mapWidth: number, mapHeight: number) => {
      const xRatio = mapWidth / gridWidth;
      const yRatio = mapHeight / gridHeight;
      return [gridPoint[1] * xRatio, gridPoint[0] * yRatio];
    };

    return (
      <Svg style={{ position: 'absolute', top: 0, left: 0, width: mapWidth, height: mapHeight }}>
        {path.slice(1).map((point, index) => {
          const prevPoint = path[index];
          const currentPoint = point;

          if (!prevPoint || !currentPoint) return null;

          // Convert grid points to screen points
          const [x1, y1] = mapToScreenCoordinates(prevPoint, mapWidth, mapHeight, mapWidth, mapHeight);
          const [x2, y2] = mapToScreenCoordinates(currentPoint, mapWidth, mapHeight, mapWidth, mapHeight);

          if (x1 >= 0 && x1 <= mapWidth && y1 >= 0 && y1 <= mapHeight &&
              x2 >= 0 && x2 <= mapWidth && y2 >= 0 && y2 <= mapHeight) {
            return (
              <Line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="red"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            );
          } else {
            console.error(`Point out of bounds: (${x1}, ${y1}) to (${x2}, ${y2})`);
            return null;
          }
        })}
        {/* <Defs>
          <Marker
            id="arrow"
            markerWidth="5"
            markerHeight="10"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <Path d="M0,0 L0,6 L9,3 z" fill="#f00" />
          </Marker>
        </Defs> */}
      </Svg>
    );
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
        <ScrollView horizontal={true}>
        <ScrollView>
          <Animated.View style={[styles.mapEditor, { transform: [{ scale: zoomLevel }], width: mapWidth, height: mapHeight }]}>
            {sections.map(({ id, name, left, top, rotation, width, height }) => {
              const isFoundItem = itemFoundList.some(item => item.shelfId === id);
              console.log(isFoundItem)
              return (
                <Section
                  key={id}
                  id={id}
                  name={name}
                  left={left}
                  top={top}
                  rotation={rotation}
                  currentOffset={currentOffset}
                  style={{ backgroundColor: isFoundItem ? 'green' : '#007bff' }} 
                />
              );
            })}
            {entrance && <Entrance {...entrance} />}
            {drawPath()}
            {drawUserLocation()}
          </Animated.View>
        </ScrollView>
      </ScrollView>
        <Modal visible={isScannedDataOpen} transparent={true} onRequestClose={toggleIsScannedDataOpen}>
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleIsScannedDataOpen}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <ScanItem handleData={handleScannedData}/>
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
