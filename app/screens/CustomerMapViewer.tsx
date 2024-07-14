import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRoute, RouteProp } from '@react-navigation/native';
import Section from '../../src/components/Section';
import Entrance from '../../src/components/Entrance';
import '../../src/styles/MapEditor.css';
import { RootStackParamList } from '../AppNavigator';

interface SectionType {
  id: number;
  name: string;
  left: number;
  top: number;
  rotation: number;
  width: number;
  height: number;
}

interface EntranceType {
  left: number;
  top: number;
}

type CustomerMapViewerRouteProp = RouteProp<RootStackParamList, 'CustomerMapViewer'>;

const CustomerMapViewer: React.FC = () => {
  const route = useRoute<CustomerMapViewerRouteProp>();
  const { supermarketId, listId } = route.params;
  const [sections, setSections] = useState<SectionType[]>([]);
  const [entrance, setEntrance] = useState<EntranceType | null>(null);
  const [path, setPath] = useState<number[][]>([]);
  const [currentOffset, setCurrentOffset] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapWidth = 800;
  const mapHeight = 600;

  const loadMapAndPath = async (supermarketId: string, listId: string | null) => {
    const response = await fetch('http://localhost:7071/api/calculatePath', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ supermarketId, listId })
    });

    if (response.ok) {
      const data = await response.json();
      setSections(data.map.sections || []);
      setEntrance(data.map.entrance || null);
      setPath(data.path || []);
    } else {
      alert('Error loading map and path');
    }
  };

  useEffect(() => {
    // Load initial map and path data if needed
    loadMapAndPath(supermarketId, listId);
  }, [supermarketId, listId]);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button onClick={() => loadMapAndPath(supermarketId, listId)}>
          Start Shopping
        </button>
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
        </div>
      </div>
    </DndProvider>
  );
};

export default CustomerMapViewer;
