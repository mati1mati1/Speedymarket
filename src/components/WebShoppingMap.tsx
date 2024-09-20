import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';

import WebSection from './WebSection';
import WebEntrance from './WebEntrance';
import { EntranceType, SectionType, ItemWithLocation } from '../services/mapService';
import PathDrawer from './drawPath';

interface shoppingMapProps {
  sections: SectionType[];
  entrance: EntranceType | null;
  path: number[][];
  itemFoundList: ItemWithLocation[];
}
const WebShoppingMap: React.FC<shoppingMapProps> = ({ sections, entrance, path, itemFoundList }) => {

  return (
      <View style={styles.viewerContainer}>
        <ScrollView horizontal={true}>
          <ScrollView>
            <View style={[styles.mapEditor, { width: 800, height: 600 }]}>
              {sections.map(({ id, name, left, top, rotation }) => {
                const isFoundItem = itemFoundList.some(item => item.shelfId === id);
                return (
                  <WebSection
                    key={id}
                    id={id}
                    left={left}
                    top={top}
                    rotation={rotation}
                    style={{ backgroundColor: isFoundItem ? 'green' : '#007bff' }} 
                    currentOffset={null}                  />
                );
              })}
              {entrance && <WebEntrance {...entrance} />}
              <PathDrawer path={path} mapWidth={800} mapHeight={600} />
            </View>
          </ScrollView>
        </ScrollView>
      </View>
  );
};

export default WebShoppingMap;

const styles = StyleSheet.create({
  viewerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapEditor: { borderWidth: 1, borderColor: 'black' },
});
