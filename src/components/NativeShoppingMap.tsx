import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import NativeSection from './NativeSection';
import NativeEntrance from './NativeEntrance';
import { EntranceType, SectionType, ItemWithLocation } from '../services/mapService';
import PathDrawer from './drawPath';

interface ShoppingMapProps {
  sections: SectionType[];
  entrance: EntranceType | null;
  path: number[][];
  itemFoundList: ItemWithLocation[];
}

const NativeShoppingMap: React.FC<ShoppingMapProps> = ({ sections, entrance, path, itemFoundList }) => {
  const mapWidth = 800;
  const mapHeight = 600;

  const { width: screenWidth } = Dimensions.get('window');

  const initialScale = screenWidth / mapWidth;
  const scaledWidth = mapWidth * initialScale;

  const [zoomLevel] = useState(new Animated.Value(initialScale));
  const panOffset = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const zoomValue = useRef(initialScale); 

  useEffect(() => {
    const zoomListenerId = zoomLevel.addListener(({ value }) => {
      zoomValue.current = value;
    });

    return () => {
      zoomLevel.removeListener(zoomListenerId);
    };
  }, [zoomLevel]);

  const handlePinch = Animated.event([{ nativeEvent: { scale: zoomLevel } }], {
    useNativeDriver: false,
    listener: (event: any) => {
      const currentZoom = (event as any).nativeEvent.scale;
      const clampedZoom = Math.max(initialScale, currentZoom); 
      zoomLevel.setValue(clampedZoom); 
    },
  });

  const handlePan = Animated.event(
    [{ nativeEvent: { translationX: panOffset.x, translationY: panOffset.y } }],
    { useNativeDriver: false }
  );

  const handlePanEnd = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;

    const currentZoom = zoomValue.current;

    const maxX = (mapWidth * currentZoom - screenWidth) / 2;

    const clampedX = Math.max(-maxX, Math.min(translationX, maxX));

    panOffset.setValue({ x: clampedX, y: translationY }); 
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={handlePan}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            handlePanEnd(event);
          }
        }}
      >
        <PinchGestureHandler onGestureEvent={handlePinch}>
          <View
            style={styles.container}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
            }}
          >
            <Animated.View
              style={[
                styles.mapContainer,
                {
                  width: mapWidth,
                  height: mapHeight,
                  transform: [
                    { scale: zoomLevel },
                    { translateX: panOffset.x },
                    { translateY: panOffset.y },
                  ],
                  marginLeft: (screenWidth - mapWidth * initialScale) / 2,
                },
              ]}
            >
              {sections.map(({ id, name, left, top, rotation }) => {
                const isFoundItem = itemFoundList.some(item => item.shelfId === id);
                return (
                  <NativeSection
                    key={id}
                    id={id}
                    name={name}
                    left={left}
                    top={top}
                    rotation={rotation}
                    style={{ backgroundColor: isFoundItem ? 'green' : '#007bff' }}
                  />
                );
              })}
              {entrance && <NativeEntrance {...entrance} />}
              <PathDrawer path={path} mapWidth={mapWidth} mapHeight={mapHeight} />
            </Animated.View>
          </View>
        </PinchGestureHandler>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default NativeShoppingMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden', 
  },
  mapContainer: {
    borderWidth: 1,
    borderColor: 'black',
    width: 800, 
    height: 600, 
  },
});
