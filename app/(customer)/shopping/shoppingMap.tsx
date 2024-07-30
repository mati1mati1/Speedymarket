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
import { fetchCurrentLocation } from '../../../src/services/locationService';
import { connectToWifi } from '../../../src/services/wifiService';
import { EntranceType, loadMapAndPath, SectionType, ItemWithLocation } from '../../../src/services/mapService';
import { getItemBySupermarketIdAndBarcode, getSupermarketBySupermarketID } from '../../../src/api/api';
import { ShopInventory, ShoppingListItem } from '../../../src/models';
import MissingItemsModal from '../../../src/components/MissingItemsModal';
import FoundItemsModal from '../../../src/components/FoundItemsModal';
import Payments from '../../../src/components/Payments';
import ShoppingCart from '../../../src/components/ShoppingCart';
import ScanItem from '../../../src/components/Scanner';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import QuantityModal from '../../../src/components/QuantityModal'; // Import the QuantityModal component

const Entrance = Platform.OS === 'web' ? WebEntrance : NativeEntrance;
const Section = Platform.OS === 'web' ? WebSection : NativeSection;

const CustomerMapViewer: React.FC = () => {
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
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false); // State for QuantityModal visibility
  const [selectedItem, setSelectedItem] = useState<ShopInventory | null>(null); // State for selected item

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
        const initialCheckedItems = data.itemsWithLocations.reduce((acc: { [key: string]: boolean }, item: ItemWithLocation) => {
          acc[item.ListItemID] = false;
          return acc;
        }, {});
        setCheckedItems(initialCheckedItems);
      } catch (error: any) {
        alert(error.message);
      }
    };

    fetchMapAndPath();
  }, [supermarketId, listId]);

  const handleLoadMapAndPath = async () => {
    try {
      const supermarket = await getSupermarketBySupermarketID(supermarketId || '');
      const ssid = supermarket[0]?.WiFiSSID || '';
      const password = supermarket[0]?.WiFiPassword || '';
      if (Platform.OS !== 'web') {
        await connectToWifi(ssid, password);
      }
      await loadMapAndPath(supermarketId || '', listId || '');
    } catch (error: any) {
      alert(error.message);
    }
  };

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
      if (item.length > 0) {
        setSelectedItem(item[0]); // Set the selected item
        setIsQuantityModalVisible(true); // Show the QuantityModal
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
      const itemWithQuantity = { ...selectedItem, quantity };
      setShoppingCart((prevCart) => [...prevCart, itemWithQuantity]);
      setIsQuantityModalVisible(false);
    }
  };

  const toggleFoundItemsModal = () => {
    setIsFoundItemsModalOpen(!isFoundItemsModalOpen);
  };

  const toggleIsScannedDataOpen = () => {
    //setScannedDataModalOpen(!isScannedDataOpen);
    debugger
    handleScannedData('7290010298273');
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

  const drawPath = () => (
    <Svg style={{ position: 'absolute', top: 0, left: 0, width: mapWidth, height: mapHeight }}>
      {path.slice(1).map((point, index) => {
        const prevPoint = path[index];
        return (
          <Line
            key={index}
            x1={prevPoint[1]}
            y1={prevPoint[0]}
            x2={point[1]}
            y2={point[0]}
            stroke="red"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
        );
      })}
      <Defs>
        <Marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <Path d="M0,0 L0,6 L9,3 z" fill="#f00" />
        </Marker>
      </Defs>
    </Svg>
  );

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

  const drawItemLocations = () => (
    <Svg style={{ position: 'absolute', top: 0, left: 0, width: mapWidth, height: mapHeight }}>
      {itemFoundList.map((item, index) => (
        <Circle
          key={index}
          cx={item.location.x}
          cy={item.location.y}
          r={5}
          fill="green"
        />
      ))}
    </Svg>
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
              {sections.map(({ id, name, left, top, rotation, width, height }) => (
                <Section
                  key={id}
                  id={id}
                  name={name}
                  left={left}
                  top={top}
                  rotation={rotation}
                  currentOffset={currentOffset}
                />
              ))}
              {entrance && <Entrance {...entrance} />}
              {drawPath()}
              {drawUserLocation()}
              {drawItemLocations()}
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
              <ShoppingCart isOpen={isShoppingCartOpen} onRequestClose={toggleShoppingCart} itemInCard={shoppingCart} />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={isPaymentState} transparent={true} onRequestClose={toggleShoppingCart}>
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleShoppingCart}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <Payments items={shoppingCart} />
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

export default CustomerMapViewer;

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
