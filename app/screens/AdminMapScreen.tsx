import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { GestureEvent, PanGestureHandler, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Svg, { Line, Polyline, Defs, Marker, Path } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface Element {
  id: number;
  type: 'shelf' | 'aisle' | 'number';
  x: number;
  y: number;
  length: number;
}

const AdminMapScreen: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [currentId, setCurrentId] = useState(1);

  const addElement = (type: 'shelf' | 'aisle' | 'number') => {
    setElements((prevElements) => [
      ...prevElements,
      {
        id: currentId,
        type,
        x: screenWidth / 2,
        y: screenHeight / 2,
        length: 50,
      },
    ]);
    setCurrentId(currentId + 1);
  };

  const handleGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>, element: Element) => {
    const { translationX, translationY } = event.nativeEvent;
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === element.id
          ? { ...el, x: el.x + translationX, y: el.y + translationY } 
          : el
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.button} onPress={() => addElement('shelf')}>
          <Text style={styles.buttonText}>Add Shelf</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addElement('aisle')}>
          <Text style={styles.buttonText}>Add Aisle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addElement('number')}>
          <Text style={styles.buttonText}>Add Number</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <Svg height="100%" width="100%" viewBox={`0 0 ${screenWidth} ${screenHeight}`}>
          <Defs>
            <Marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <Path d="M0,0 L0,7 L10,3.5 z" fill="brown" />
            </Marker>
          </Defs>
          {elements.map((element) => (
            <React.Fragment key={element.id}>
              {element.type === 'shelf' && (
                <PanGestureHandler onGestureEvent={(e) => handleGestureEvent(e, element)}>
                  <View>
                    <Line
                      x1={element.x}
                      y1={element.y}
                      x2={element.x + element.length}
                      y2={element.y}
                      stroke="gray"
                      strokeWidth="4"
                    />
                  </View>
                </PanGestureHandler>
              )}
              {element.type === 'aisle' && (
                <PanGestureHandler onGestureEvent={(e) => handleGestureEvent(e, element)}>
                  <View>
                    <Polyline
                      points={`${element.x},${element.y} ${element.x + element.length},${element.y}`}
                      fill="none"
                      stroke="brown"
                      strokeWidth="4"
                      markerEnd="url(#arrowhead)"
                    />
                  </View>
                </PanGestureHandler>
              )}
              {element.type === 'number' && (
                <PanGestureHandler onGestureEvent={(e) => handleGestureEvent(e, element)}>
                  <View>
                    <Text style={[styles.numberText, { position: 'absolute', left: element.x, top: element.y }]}>
                      {element.id}
                    </Text>
                  </View>
                </PanGestureHandler>
              )}
            </React.Fragment>
          ))}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
  },
  numberText: {
    fontSize: 16,
    color: 'black',
  },
});

export default AdminMapScreen;
