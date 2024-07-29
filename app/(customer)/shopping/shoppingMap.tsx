import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform, ScrollView } from 'react-native';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WebSection from '../../../src/components/WebSection';
import WebEntrance from '../../../src/components/WebEntrance';
import NativeSection from '../../../src/components/NativeSection';
import NativeEntrance from '../../../src/components/NativeEntrance';
import Svg, { Line, Defs, Marker, Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import { fetchCurrentLocation } from '../../../src/services/locationService';
import { connectToWifi } from '../../../src/services/wifiService';
import { EntranceType, loadMapAndPath, SectionType, ItemWithLocation } from '../../../src/services/mapService';
import { getSupermarketBySupermarketID } from '../../../src/api/api';
import { ShopInventory, ShoppingListItem } from '../../../src/models';
import MissingItemsModal from '../../../src/components/MissingItemsModal';
import FoundItemsModal from '../../../src/components/FoundItemsModal';
import Payments from '../../../src/components/Payments';
import ShoppingCart from '../../../src/components/ShoppingCart';
import ScanItem from '../../../src/components/Scanner';

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

  const mapWidth = 1200; // Adjust the width as necessary
  const mapHeight = 900; // Adjust the height as necessary

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

  useEffect(() => {
    const updateLocation = async () => {
      try {
        if (Platform.OS === 'web') {
          return;
        }
        const location = await fetchCurrentLocation(supermarketId || '');
        if(location){
          setUserLocation(location);
        }
      } catch (error: any) {
        console.error('Error fetching location:', error);
      }
    };

    const interval = setInterval(updateLocation, 5000); // Update every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [supermarketId]);

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
    setCheckedItems(prevCheckedItems => ({
      ...prevCheckedItems,
      [itemId]: !prevCheckedItems[itemId]
    }));
  };

  const handleAddToCart = (item: ShopInventory) => {
    setShoppingCart(prevCart => [...prevCart, item]);
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

  return (
    <DndProvider backend={HTML5Backend}>
      <View style={styles.viewerContainer}>
        <View style={styles.buttonContainer}>
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
        </View>
        <ScrollView horizontal style={{ width: '100%' }}>
          <ScrollView style={{ height: '100%' }}>
            <View style={[styles.mapEditor, { width: mapWidth, height: mapHeight }]}>
              {sections.map(({ id, name, left, top, rotation }) => (
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
              {entrance && <Entrance left={entrance.left} top={entrance.top} />}
              {drawPath()}
              {drawUserLocation()}
            </View>
          </ScrollView>
        </ScrollView>

        <Modal
          visible={isScannedDataOpen}
          transparent={true}
          onRequestClose={toggleIsScannedDataOpen}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleIsScannedDataOpen}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <ScanItem handleData={handleAddToCart} supermarketId={supermarketId || ''} />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={isFoundItemsModalOpen}
          transparent={true}
          onRequestClose={toggleFoundItemsModal}
        >
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

        <Modal
          visible={isMissingItemsModalOpen}
          transparent={true}
          onRequestClose={toggleMissingItemsModal}
        >
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

        <Modal
          visible={isShoppingCartOpen}
          transparent={true}
          onRequestClose={toggleShoppingCart}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleShoppingCart}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <ShoppingCart
                isOpen={isShoppingCartOpen}
                onRequestClose={toggleShoppingCart}
                itemInCard={shoppingCart}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={isPaymentState}
          transparent={true}
          onRequestClose={toggleShoppingCart}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleShoppingCart}>
            <View style={styles.modal} onStartShouldSetResponder={() => true}>
              <Payments items={shoppingCart} />
            </View>
          </TouchableOpacity>
        </Modal>

      </View>
    </DndProvider>
  );
};


const styles = StyleSheet.create({
  viewerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapEditor: {
    width: 800,
    height: 600,
    borderColor: 'black',
    borderWidth: 1,
    position: 'relative',
    marginVertical: 20,
    marginHorizontal: 'auto',
    backgroundColor: '#f0f0f0',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 20,
    backgroundColor: '#ddd',
    height: '100%',
  },
  section: {
    width: 100,
    height: 50,
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
    lineHeight: 50, // Not supported in React Native, needs an alternative
    borderColor: '#0056b3',
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: 'white',
    position: 'absolute',
    top: -10,
    left: 45,
  },
  entrance: {
    width: 100,
    height: 50,
    backgroundColor: 'green',
    color: 'white',
    textAlign: 'center',
    lineHeight: 50, // Not supported in React Native, needs an alternative
    borderColor: '#004d00',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aisle: {
    backgroundColor: 'yellow',
    borderColor: '#cccc00',
    borderWidth: 1,
    position: 'absolute',
    cursor: 'pointer', // Not supported in React Native, use onPress for functionality
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start', // Aligns modals at the top
    paddingTop: 20, // Adds some padding from the top
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'hidden', // overflow-y is not supported, use ScrollView if needed
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, // Not directly supported in React Native, use margin or padding
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomerMapViewer;
