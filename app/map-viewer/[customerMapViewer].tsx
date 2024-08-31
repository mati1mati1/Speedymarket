import { useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Pressable } from 'react-native';
import { getSupermarketBySupermarketID } from '../../src/api/api';
import Entrance from '../../src/components/WebEntrance';
import Section from '../../src/components/WebSection';
import { fetchCurrentLocation } from '../../src/services/locationService';
import { SectionType, EntranceType, loadMapAndPath } from '../../src/services/mapService';
import { connectToWifi } from '../../src/services/wifiService';


const CustomerMapViewer: React.FC = () => {
  const { supermarketId, listId } = useLocalSearchParams<{ supermarketId: string; listId?: string }>();
  const [sections, setSections] = useState<SectionType[]>([]);
  const [entrance, setEntrance] = useState<EntranceType | null>(null);
  const [path, setPath] = useState<number[][]>([]);
  const [currentOffset, setCurrentOffset] = useState<{ x: number; y: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapWidth = 800;
  const mapHeight = 600;

  useEffect(() => {
    const fetchMapAndPath = async () => {
      try {
        const data = await loadMapAndPath(supermarketId || '', listId || '');
        setSections(data.map.sections || []);
        setEntrance(data.map.entrance || null);
        setPath(data.path || []);
      } catch (error: any) {
        alert(error.message);
      }
    };

    fetchMapAndPath();
  }, [supermarketId, listId]);

  useEffect(() => {
    const updateLocation = async () => {
      try {
        const location = await fetchCurrentLocation(supermarketId || '');
        //setUserLocation(location);
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
      const ssid = 'Supermarket_WiFi_SSID'; // Replace with actual SSID if necessary
      const password = supermarket[0]?.WiFiPassword || '';

      await connectToWifi(ssid, password);
      await loadMapAndPath(supermarketId || '', listId || '');
    } catch (error: any) {
      alert(error.message);
    }
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
      <div>
        <Pressable onPress={handleLoadMapAndPath}>
          Start Shopping
        </Pressable>
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
      </div>
    </DndProvider>
  );
};

export default CustomerMapViewer;