import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';
import WebSection from '../../src/components/WebSection';
import WebEntrance from '../../src/components/WebEntrance';
import { getSupermarketByUserId, updateMap } from '../../src/api/api';
import useAuth from '../../src/hooks/useAuth';

interface Section {
  id: number;
  name: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

interface Entrance {
  x: number;
  y: number;
}

const ManagerMapEditor: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [entrance, setEntrance] = useState<Entrance | null>(null);
  const [shelfCounter, setShelfCounter] = useState(1);
  const [supermarket, setSupermarket] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const token = useAuth();
  const mapWidth = 800;
  const mapHeight = 800;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSupermarket = (await getSupermarketByUserId(token))[0];
        if (fetchedSupermarket) {
          setSupermarket(fetchedSupermarket);
          const branchMap = JSON.parse(fetchedSupermarket.BranchMap);
          setSections(branchMap.sections || []);
          setEntrance(branchMap.entrance || null);
          setShelfCounter(branchMap.sections.length + 1);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const addSection = (x: number, y: number, rotation: number) => {
    setSections((sections) => [
      ...sections,
      { id: shelfCounter, name: 'מדף', x, y, rotation, width: 80, height: 40 }
    ]);
    setShelfCounter(shelfCounter + 1);
  };

  const cleanMap = () => {
    setSections([]);
    setEntrance(null);
    setShelfCounter(1);
  };

  const moveSection = (id: number, gestureState: any) => {
    debugger
    setSections((sections) =>
      sections.map((section) =>
        section.id === id
          ? {
              ...section,
              
              x: section.x + gestureState.dx,
              y: section.y + gestureState.dy,
            }
          : section
      )
    );
  };

  const adjustPosition = (id: number, x: number, y: number, rotation: number) => {
    let adjustedX = x;
    let adjustedY = y;
    let overlap = true;
    const itemWidth = rotation % 180 === 0 ? 80 : 40;
    const itemHeight = rotation % 180 === 0 ? 40 : 80;

    while (overlap) {
      overlap = false;
      sections.forEach(section => {
        if (section.id !== id) {
          const sectionWidth = section.rotation % 180 === 0 ? 80 : 40;
          const sectionHeight = section.rotation % 180 === 0 ? 40 : 80;
          const sectionRight = section.x + sectionWidth;
          const sectionBottom = section.y + sectionHeight;

          const itemRight = adjustedX + itemWidth;
          const itemBottom = adjustedY + itemHeight;

          const isOverlapping = !(sectionRight <= adjustedX || section.x >= itemRight || sectionBottom <= adjustedY || section.y >= itemBottom);

          if (isOverlapping) {
            overlap = true;
            let newX = adjustedX;
            let newY = adjustedY;

            if (adjustedY < section.y) {
              newY = section.y - itemHeight;
            } else if (adjustedY > section.y) {
              newY = section.y + sectionHeight;
            }

            if (adjustedX < section.x) {
              newX = section.x - itemWidth;
            } else if (adjustedX > section.x) {
              newX = section.x + sectionWidth;
            }

            adjustedX = newX;
            adjustedY = newY;
          }
        }
      });
    }

    return { x: adjustedX, y: adjustedY };
  };

  const moveEntrance = (gestureState: any) => {
    debugger;
    if (entrance) {
      console.log('moveEntrance triggered');
      setEntrance({ x: entrance.x + gestureState.dx, y: entrance.y + gestureState.dy });
    }
  };

  const rotateSection = (id: number) => {
    if (!isDragging) {
      setSections((sections) =>
        sections.map((section) => {
          if (section.id === id) {
            const newRotation = (section.rotation + 90) % 360;
            const adjustedPosition = adjustPosition(id, section.x, section.y, newRotation);
            return {
              ...section,
              rotation: newRotation,
              x: adjustedPosition.x,
              y: adjustedPosition.y,
              width: newRotation % 180 === 0 ? 80 : 40,
              height: newRotation % 180 === 0 ? 40 : 80,
            };
          }
          return section;
        })
      );
    }
  };

  const getMaxX = (rotation: number) => {
    return rotation === 0 || rotation === 180 ? mapWidth - 80 : mapWidth - 40;
  };

  const getMaxY = (rotation: number) => {
    return rotation === 0 || rotation === 180 ? mapHeight - 40 : mapHeight - 60;
  };

  const saveMapToDB = async () => {
    const mapData = { sections, entrance, mapWidth, mapHeight };
    await updateMap(supermarket.SupermarketID, JSON.stringify(mapData));
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.viewerContainer}>
      <View style={styles.buttonRow}>
        <Button title="שמור מפה" onPress={saveMapToDB} color="blue" />
        <Button title="הוסף מדף" onPress={() => addSection(0, 0, 0)} color="blue" />
        <Button title="נקה מפה" onPress={cleanMap} color="blue" />
        <Button title="הוסף כניסה" onPress={() => !entrance && setEntrance({ x: 0, y: 0 })} color="blue" />
      </View>
      <View style={[styles.mapEditor, { width: mapWidth, height: mapHeight }]}>
        {sections.map(({ id, x, y, rotation }) => (
          <Draggable
            key={`section-${id}`}
            x={x}
            minX={0}
            minY={0}
            maxX={getMaxX(rotation)}
            maxY={getMaxY(rotation)}
            y={y}
            onDrag={() => setIsDragging(true)}
            onDragRelease={(event, gestureState) => moveSection(id, gestureState)}
            onLongPress={() => rotateSection(id)}>
              <WebSection id={id} left={x} top={y} rotation={rotation} />
          </Draggable>
        ))}
        {entrance && (
          <Draggable
            x={entrance.x}
            y={entrance.y}
            minX={0}
            minY={0}
            maxX={mapWidth - 50}
            maxY={mapHeight - 50}
            onDragRelease={(event, gestureState) => {
              console.log('Drag release detected for entrance');
              moveEntrance(gestureState);
            }}
          >
              <WebEntrance x={entrance.x} y={entrance.y} />
          </Draggable>
        )}
      </View>
    </View>
  );
};

export default ManagerMapEditor;

const styles = StyleSheet.create({
  viewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapEditor: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  section: {
    position: 'absolute',
    width: 80,
    height: 40,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black'
  },
  entrance: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black'
  },
});
