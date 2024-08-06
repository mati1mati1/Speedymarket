import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Rows, Picker } from 'react-native-table-component';
import useAuth from '../../src/hooks/useAuth';
import { getSupermarketByUserId, updateSupermarketDetails } from '../../src/api/api';
import { getCountries, getCities } from '../../src/api/locationApi'; // Import your API functions
import { CountryResponse } from '../../src/models';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ManagerSettingsScreen = () => {
  const token = useAuth();
  const [supermarket, setSupermarket] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [wifiSSID, setWiFiSSID] = useState('');
  const [wifiPassword, setWiFiPassword] = useState('');
  const [operatingHours, setOperatingHours] = useState<{ day: string; openHour: string; closeHour: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState<{ day: string; openHour: string; closeHour: string } | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchSupermarketDetails = async () => {
      try {
        const fetchedSupermarket = await getSupermarketByUserId(token);
        if (fetchedSupermarket) {
          setSupermarket(fetchedSupermarket[0]);
          setName(fetchedSupermarket[0].BranchName);
          setCountry(fetchedSupermarket[0].Country || '');
          setCity(fetchedSupermarket[0].City || '');
          setStreet(fetchedSupermarket[0].Street || '');
          setStreetNumber(fetchedSupermarket[0].StreetNumber || '');
          setWiFiSSID(fetchedSupermarket[0].WiFiSSID);
          setWiFiPassword(fetchedSupermarket[0].WiFiPassword);
          setOperatingHours(fetchedSupermarket[0].OperatingHours || daysOfWeek.map(day => ({ day, openHour: '', closeHour: '' })));
        }
      } catch (error) {
        console.error('Failed to fetch supermarket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupermarketDetails();
  }, [token]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const fetchedCountries = await getCountries();
        setCountries(fetchedCountries);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (country) {
      const fetchCities = async () => {
        try {
          const fetchedCities = await getCities(country);
          setCities(fetchedCities);
        } catch (error) {
          console.error('Failed to fetch cities:', error);
        }
      };

      fetchCities();
    }
  }, [country]);

  const handleFormChange = (field: string, value: string) => {
    if (currentDay) {
      setCurrentDay({ ...currentDay, [field]: value });
    }
  };

  const handleSave = async () => {
    try {
      await updateSupermarketDetails({
        SupermarketID: supermarket.SupermarketID,
        Name: name,
        Country: country,
        City: city,
        Street: street,
        StreetNumber: streetNumber,
        WiFiSSID: wifiSSID,
        WiFiPassword: wifiPassword,
        OperatingHours: operatingHours,
      });
      Alert.alert('Success', 'Supermarket details updated successfully');
    } catch (error) {
      console.error('Failed to update supermarket details:', error);
      Alert.alert('Error', 'Failed to update supermarket details');
    }
  };

  const handleEditHours = (day: string) => {
    const dayHours = operatingHours.find(d => d.day === day);
    setCurrentDay(dayHours || { day, openHour: '', closeHour: '' });
    setIsModalVisible(true);
  };

  const handleSaveHours = () => {
    if (currentDay) {
      setOperatingHours(prevHours =>
        prevHours.map(hour => (hour.day === currentDay.day ? currentDay : hour))
      );
      setIsModalVisible(false);
      setCurrentDay(null);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Supermarket Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Supermarket Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Supermarket Name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Country</Text>
        <Picker
          selectedValue={country}
          onValueChange={(itemValue) => setCountry(itemValue)}
          style={styles.input}
        >
          {countries.map((country) => (
            <Picker.Item key={country} label={country} value={country} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>City</Text>
        <Picker
          selectedValue={city}
          onValueChange={(itemValue) => setCity(itemValue)}
          style={styles.input}
        >
          {(cities || []).map((city) => (
            <Picker.Item key={city} label={city} value={city} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Street</Text>
        <TextInput
          style={styles.input}
          value={street}
          onChangeText={setStreet}
          placeholder="Street"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Street Number</Text>
        <TextInput
          style={styles.input}
          value={streetNumber}
          onChangeText={setStreetNumber}
          placeholder="Street Number"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>WiFi SSID</Text>
        <TextInput
          style={styles.input}
          value={wifiSSID}
          onChangeText={setWiFiSSID}
          placeholder="WiFi SSID"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>WiFi Password</Text>
        <TextInput
          style={styles.input}
          value={wifiPassword}
          onChangeText={setWiFiPassword}
          placeholder="WiFi Password"
          secureTextEntry
        />
      </View>

      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row
                data={['Day', 'Open Hour', 'Close Hour', 'Actions']}
                style={styles.head}
                textStyle={styles.text}
                widthArr={[screenWidth / 4, screenWidth / 4, screenWidth / 4, screenWidth / 4]}
              />
              <TableWrapper style={styles.wrapper}>
                <Rows
                  data={operatingHours.map(hour => [
                    hour.day,
                    hour.openHour,
                    hour.closeHour,
                    <Button title="Edit" onPress={() => handleEditHours(hour.day)} />
                  ])}
                  textStyle={styles.text}
                  widthArr={[screenWidth / 4, screenWidth / 4, screenWidth / 4, screenWidth / 4]}
                />
              </TableWrapper>
            </Table>
          </View>
        </ScrollView>
      </ScrollView>

      <Button title="Save" onPress={handleSave} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{currentDay?.day}</Text>
            <TextInput
              placeholder="Open Hour"
              value={currentDay?.openHour}
              onChangeText={value => handleFormChange('openHour', value)}
              style={styles.input}
            />
            <TextInput
              placeholder="Close Hour"
              value={currentDay?.closeHour}
              onChangeText={value => handleFormChange('closeHour', value)}
              style={styles.input}
            />
            <View style={styles.buttonRow}>
              <Button title="Save" onPress={handleSaveHours} />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  head: {
    height: 50,
    backgroundColor: '#f1f8ff',
  },
  wrapper: {
    flexDirection: 'row',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400, // limit modal width
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default ManagerSettingsScreen;
