import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Section from '../../../src/components/Section';
import Entrance from '../../../src/components/Entrance';
import '../../../src/styles/MapEditor.css';
import { PermissionsAndroid, Platform, Pressable } from 'react-native';
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
import '../../../src/styles/MapEditor.css'; // Import CSS file for styling

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
  const [isMissingItemsModalOpen, setIsMissingItemsModalOpen] = useState(false);
  const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false);
  const [isPaymentState, setIsPaymentState] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapWidth = 800;
  const mapHeight = 600;

  useEffect(() => {
    const fetchMapAndPath = async () => {
      try {
        console.log('supermarketId:', supermarketId);
        console.log('listId:', listId);
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
      if(Platform.OS !== 'web'){
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

  const handleAddToCart = (item: ItemWithLocation) => {
    setShoppingCart(prevCart => [...prevCart, item]);
  };

  const toggleFoundItemsModal = () => {
    setIsFoundItemsModalOpen(!isFoundItemsModalOpen);
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
    <svg style={{ position: 'absolute', top: 0, left: 0, width: mapWidth, height: mapHeight }}>
      {path.slice(1).map((point, index) => {
        const prevPoint = path[index];
        return (
          <line
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
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
        </marker>
      </defs>
    </svg>
  );

  const drawUserLocation = () => (
    userLocation && (
      <div
        style={{
          position: 'absolute',
          left: `${userLocation.x}px`,
          top: `${userLocation.y}px`,
          width: '10px',
          height: '10px',
          backgroundColor: 'blue',
          borderRadius: '50%',
        }}
      />
    )
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="viewer-container">
        <div className="button-container">
          <button className="action-button" onClick={toggleFoundItemsModal}>Show Found Items</button>
          <button className="action-button" onClick={toggleMissingItemsModal}>Show Missing Items</button>
          <button className="action-button" onClick={toggleShoppingCart}>Show Shopping Cart</button>
          <button className="action-button" onClick={togglePayment}>Pay now</button>

        </div>
        <div ref={mapRef} className="map-editor" style={{ position: 'relative', width: `${mapWidth}px`, height: `${mapHeight}px`, border: '1px solid black' }}>
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
          {entrance && (
            <Entrance left={entrance.left} top={entrance.top} />
          )}
          {drawPath()}
          {drawUserLocation()}
        </div>
        <div className="button-container">
          <button  className="action-button" onClick={handleLoadMapAndPath}>Scan Barcode</button>
        </div>
        {isFoundItemsModalOpen && (
          <div className="modal-overlay" onClick={toggleFoundItemsModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <FoundItemsModal
                isOpen={isFoundItemsModalOpen}
                onRequestClose={toggleFoundItemsModal}
                items={itemFoundList}
                checkedItems={checkedItems}
                onCheckboxChange={handleCheckboxChange}
              />
            </div>
          </div>
        )}

        {isMissingItemsModalOpen && (
          <div className="modal-overlay" onClick={toggleMissingItemsModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <MissingItemsModal
                isOpen={isMissingItemsModalOpen}
                onRequestClose={toggleMissingItemsModal}
                items={missingItemList}
                shoppingCart={shoppingCart}
              />
            </div>
          </div>
        )}

        {isShoppingCartOpen && (
          <div className="modal-overlay" onClick={toggleShoppingCart}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <ShoppingCart isOpen={isShoppingCartOpen} onRequestClose={toggleShoppingCart} itemInCard={shoppingCart} />
            </div>
          </div>
        )}

        {isPaymentState && (
          <div className="modal-overlay" onClick={toggleShoppingCart}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <Payments items={shoppingCart} />
            </div>
          </div>
        )}

      </div>
    </DndProvider>
  );
};

export default CustomerMapViewer;
