import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, Button, Pressable, StyleSheet, Modal } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons'; 
import { getSupermarkets } from '../../../src/api/api';
import { ShoppingList, Supermarket } from '../../../src/models';
import SelectListModal from '../../../src/components/SelectListModal';
import SelectSupermarketModal from '../../../src/components/SelectSupermarketModal';
import { router } from 'expo-router';

const SupermarketMapsScreen = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [supermarketModalVisible, setSupermarketModalVisible] = useState(false);
  const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isSupermarketLoading, setIsSupermarketLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  const handleSelectList = (supermarket: Supermarket | null) => {
    if(supermarket != null){
      setSelectedSupermarket(supermarket);
    }
      setListModalVisible(true);
  };

  const closeListModal = async (selectedList: ShoppingList | null) => {
    setSelectedList(selectedList);
    await setListModalVisible(false);
    if (selectedSupermarket){
      startShopping(selectedSupermarket, selectedList);
    }
  };

  const handleStartWithoutList = () => {
    setSelectedList(null);
  };
  const closeSupermarketModal = (selectedSupermarket: Supermarket | null) => {
    setSupermarketModalVisible(false);
    setSelectedSupermarket(selectedSupermarket);
  };

  const startShopping = (supermarket: Supermarket | null, list: ShoppingList | null) => {
    disconnectMap();
    if (supermarket != null) {
      router.push({
        pathname: '/shopping/shoppingMap',
        params: { supermarketId: supermarket?.SupermarketID, listId: list?.ListID }
      });
  }
    else {
      alert('Please select a supermarket before starting shopping.');
    }
  };

  const handleSelectSupermarket = () => {
    setSupermarketModalVisible(true);
  };
  useEffect(() => {
    const fetchSupermarkets = async () => {
      setIsLoading(true);
      try {
        const fetchedSupermarkets = await getSupermarkets();
        if (fetchedSupermarkets) {
          setSupermarkets(fetchedSupermarkets);
        }
      } catch (error) {
        console.error('Failed to fetch supermarkets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupermarkets();
  }, []);

  const centerOnLocation = async () => {
    if(!currentLocation){
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      setRegion(newRegion);
    }
    if (currentLocation  && currentLocation.coords) {
      mapRef.current?.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const disconnectMap = () => {
    setCurrentLocation(null);
    setRegion(undefined);
    mapRef.current?.animateToRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };
  useEffect(() => {
    if (region === undefined) {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      setRegion(newRegion);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    };
    getLocation();
  }
  }, [region]);

  return (
    <View style={{ flex: 1 }}>
      {region && (
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'web' ? 'google' : undefined}
          style={{ flex: 1 }}
          initialRegion={region}
          showsUserLocation={true}
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="Your Location"
            />
          )}
          {!isLoading &&
            supermarkets.map((supermarket) => {
              if (!supermarket.Latitude || !supermarket.Longitude) {
                console.warn(`Invalid coordinates for supermarket: ${supermarket.BranchName}`);
                return null;  // Skip rendering this marker
              }
              const operatingHours = Array.isArray(supermarket.OperatingHours)
                ? supermarket.OperatingHours
                : JSON.parse(supermarket.OperatingHours);
              return (
                <Marker
                  key={supermarket.SupermarketID}
                  coordinate={{
                    latitude: supermarket.Latitude,
                    longitude: supermarket.Longitude,
                  }}
                >
                  <FontAwesome name="shopping-cart" size={30} color="red" />
                  <Callout>
                    <View>
                      <Text>{supermarket.BranchName}</Text>
                      <Text>Open Hours:</Text>
                      {Array.isArray(operatingHours) ? (
                        operatingHours.map((hours, index) => (
                          <Text key={index}>
                            {hours.day}: {hours.openHour} - {hours.closeHour}
                          </Text>
                        ))
                      ) : (
                        <Text>No operating hours available</Text>
                      )}
                      <Pressable style={styles.button} onPress={() => handleSelectList(supermarket)}>
                        <Text style={styles.buttonText}>Start shopping</Text>
                      </Pressable>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
        </MapView>
      )}
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Pressable  style={styles.button} onPress={centerOnLocation}>        
          <Text style={styles.buttonText}>Center on Location</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleSelectSupermarket}>
          <Text style={styles.buttonText}>Select supermarket from list</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={()=>handleSelectList(null)}>
        <Text style={styles.buttonText}>Select shopping list</Text>
        </Pressable>
        <Pressable
        style={[
          styles.button,
          selectedSupermarket == null && { backgroundColor: 'gray', opacity: 0.5 }
        ]}
        onPress={() => startShopping(selectedSupermarket, selectedList)}
        disabled={selectedSupermarket == null}
      >
        <Text style={styles.buttonText}>Start shopping</Text>
      </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={listModalVisible}
        onRequestClose={() => closeListModal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectListModal
              closeModal={closeListModal}
              continueWithoutList={handleStartWithoutList}
              setIsLoading={setIsListLoading}
              isLoading={isListLoading}
            />
            <Pressable style={styles.closeButton} onPress={() => closeListModal(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={supermarketModalVisible}
        onRequestClose={() => closeSupermarketModal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectSupermarketModal
              closeModal={closeSupermarketModal}
              setIsLoading={setIsSupermarketLoading}
              isLoading={isSupermarketLoading}
            />
            <Pressable style={styles.closeButton} onPress={() => closeSupermarketModal(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

export default SupermarketMapsScreen;
