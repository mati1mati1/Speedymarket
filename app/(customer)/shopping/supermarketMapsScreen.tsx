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
import { useAuth } from '../../../src/context/AuthContext';

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
    if(selectedList != null){
      if (selectedSupermarket){
        startShopping(selectedSupermarket, selectedList);
      }
    }
  };

  const handleStartWithoutList = async () => {
    setSelectedList(null);
    await setListModalVisible(false);
    if (selectedSupermarket){
      startShopping(selectedSupermarket, selectedList);
    }
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
                console.log(`Invalid coordinates for supermarket: ${supermarket.BranchName}`);
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
                    <Callout tooltip>
                      <View style={styles.calloutContainer}>
                        <Text style={styles.calloutTitle}>{supermarket.BranchName}</Text>
                        <Text style={styles.calloutSubtitle}>Open Hours:</Text>
                        {Array.isArray(operatingHours) ? (
                          operatingHours.map((hours, index) => (
                            <Text key={index} style={styles.calloutText}>
                              {hours.day}: {hours.openHour} - {hours.closeHour}
                            </Text>
                          ))
                        ) : (
                          <Text style={styles.calloutText}>No operating hours available</Text>
                        )}
                        <Pressable style={styles.calloutButton} onPress={() => handleSelectList(supermarket)}>
                          <Text style={styles.calloutButtonText}>Start shopping</Text>
                        </Pressable>
                      </View>
                    </Callout>
                  </Marker>
                );
            })}
        </MapView>
      )}
      <Pressable style={styles.locationIcon} onPress={centerOnLocation}>        
        <FontAwesome name="location-arrow" size={24} color="#007bff" />
      </Pressable>
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Pressable style={styles.button} onPress={handleSelectSupermarket}>
          <Text style={styles.buttonText}>Select Supermarket</Text>
        </Pressable>
        <Pressable
        style={[
          styles.button,
          selectedSupermarket == null && { backgroundColor: 'gray', opacity: 0.5 }
        ]}
        onPress={() => handleSelectList(selectedSupermarket)}
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
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 12, // Adjusted padding for better mobile fit
    marginVertical: 5, // Reduced margin
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 150, // Ensures the button has a minimum width
  },
  buttonText: {
    color: 'white',
    fontSize: 14, // Reduced font size
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 14,
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
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutSubtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 12,
    marginBottom: 2,
  },
  calloutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6, // Adjusted for smaller buttons
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  locationIcon: {
    position: 'absolute',
    left: 10, // Adjust to move further left or right
    top: '95%', // Center vertically
    transform: [{ translateY: -12 }], // Offset the icon to truly center it vertically
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
});


export default SupermarketMapsScreen;
