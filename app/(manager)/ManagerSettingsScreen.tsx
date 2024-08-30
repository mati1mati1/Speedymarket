import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Modal, Dimensions, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { getCountries, getCities, getStreets } from '../../src/api/locationApi';
import { Country, City, dailyHours, Street, Supermarket } from '../../src/models';
import { useAuth } from '../../src/context/AuthContext';
import { getSupermarketByUserId, updateSupermarketDetails } from '../../src/api/api';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ManagerSettingsScreen = () => {
    const token = useAuth();
    const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
    const [name, setName] = useState('');
    const [country, setCountry] = useState<Country | null>(null);
    const [city, setCity] = useState<City | null>(null);
    const [street, setStreet] = useState<Street | null>(null);
    const [streetNumber, setStreetNumber] = useState<number>(0);
    const [wifiSSID, setWiFiSSID] = useState('');
    const [wifiPassword, setWiFiPassword] = useState('');
    const [operatingHours, setOperatingHours] = useState<dailyHours[]>(daysOfWeek.map(day => ({ day, openHour: '', closeHour: '' })));
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDay, setCurrentDay] = useState<dailyHours | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [filteredCities, setFilteredCities] = useState<City[]>([]);
    const [streets, setStreets] = useState<Street[]>([]);
    const [filteredStreets, setFilteredStreets] = useState<Street[]>([]);
    const [fetchingStreets, setFetchingStreets] = useState(false);

    useEffect(() => {
        const fetchSupermarketDetails = async () => {
            try {
                const fetchedSupermarket = await getSupermarketByUserId();
                if (fetchedSupermarket && fetchedSupermarket.length > 0) {
                    const supermarketDetails = fetchedSupermarket[0];
                    setSupermarket(supermarketDetails);
                    setName(supermarketDetails.BranchName);
                    setStreetNumber(supermarketDetails.StreetNumber || 0);
                    setWiFiSSID(supermarketDetails.WiFiSSID);
                    setWiFiPassword(supermarketDetails.WiFiPassword);
                    setCountry(supermarketDetails.Country ? JSON.parse(supermarketDetails.Country as unknown as string) : null);
                    setCity(supermarketDetails.City ? JSON.parse(supermarketDetails.City as unknown as string) : null);
                    setStreet(supermarketDetails.Street ? JSON.parse(supermarketDetails.Street as unknown as string) : null);
                    let operatingHoursArray: dailyHours[];
                    try {
                        operatingHoursArray = JSON.parse(supermarketDetails.OperatingHours as unknown as string);
                    } catch (error) {
                        console.error('Failed to parse OperatingHours:', error);
                        operatingHoursArray = daysOfWeek.map(day => ({ day, openHour: '', closeHour: '' }));
                    }

                    if (Array.isArray(operatingHoursArray)) {
                        setOperatingHours(operatingHoursArray);
                    } else {
                        console.warn('OperatingHours is not an array:', operatingHoursArray);
                        setOperatingHours(daysOfWeek.map(day => ({ day, openHour: '', closeHour: '' })));
                    }
                } else {
                    setOperatingHours(daysOfWeek.map(day => ({ day, openHour: '', closeHour: '' })));
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
                setFilteredCountries(fetchedCountries);
            } catch (error) {
                console.log('Failed to fetch countries:', error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        if (country) {
            const fetchCities = async () => {
                try {
                  if(country?.iso2?.length > 0){
                    const fetchedCities = await getCities(country.iso2);
                    setCities(fetchedCities);
                    setFilteredCities(fetchedCities);
                  }
                } catch (error) {
                    console.log('Failed to fetch cities:', error);
                }
            };

            fetchCities();
        }
    }, [country]);

    useEffect(() => {
        if (city && country) {
            const fetchStreets = async () => {
                try {
                  if(city?.name?.length > 0 || country?.name?.length > 0){
                    setFetchingStreets(true);
                    const fetchedStreets = await getStreets(city.name, country.name);
                    setStreets(fetchedStreets);
                    setFilteredStreets(fetchedStreets);
                  }
                } catch (error) {
                    console.log('Failed to fetch streets:', error);
                } finally {
                    setFetchingStreets(false);
                }
            };

            fetchStreets();
        }
    }, [city, country]);

    const handleFormChange = (field: string, value: string) => {
        if (currentDay) {
            setCurrentDay({ ...currentDay, [field]: value });
        }
    };

    const handleSave = async () => {
      try {
        if(supermarket){
          supermarket.BranchName = name;
          supermarket.Country = country;
          supermarket.City = city;
          supermarket.Street = street;
          supermarket.StreetNumber = streetNumber;
          supermarket.OperatingHours = operatingHours;
          supermarket.WiFiSSID = wifiSSID;
          supermarket.WiFiPassword = wifiPassword;
          await updateSupermarketDetails(supermarket);
          alert('Supermarket details updated successfully');
        }
      } catch (error) {
          console.error('Failed to update supermarket details:', error);
          alert('Failed to update supermarket details');
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

    const filterCountries = (text: string) => {
      const filtered = countries.filter(country => country.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredCountries(filtered);
  };

  const filterCities = (text: string) => {
      const filtered = cities.filter(city => city.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredCities(filtered);
  };

  const filterStreets = (text: string) => {
      const filtered = streets.filter(street => street.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredStreets(filtered);
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
                <TextInput
                    style={styles.input}
                    value={country?.name}
                    onChangeText={(text) => {
                        setCountry(null);
                        filterCountries(text);
                    }}
                    
                />
                {(filteredCountries.length > 0 && country === null) &&(
                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.iso2}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                setCountry(item);
                                setFilteredCountries([]);
                            }}>
                                <Text style={styles.streetItem}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.streetList}
                    />
                )}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>City</Text>
                <TextInput
                    style={styles.input}
                    value={city?.name }
                    onChangeText={(text) => {
                        setCity(null);
                        filterCities(text);
                    }}
                    placeholder="Start typing city name"
                />
                {(filteredCities.length > 0 && city === null) && (
                    <FlatList
                        data={filteredCities}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                setCity(item);
                                setFilteredCities([]);
                            }}>
                                <Text style={styles.streetItem}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.streetList}
                    />
                )}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Street</Text>
                <TextInput
                    style={styles.input}
                    value={street?.name}
                    onChangeText={(text) => {
                        setStreet(null);
                        filterStreets(text);
                    }}
                    placeholder="Start typing street name"
                />
                {filteredStreets.length > 0 && street === null && (
                    <FlatList
                        data={filteredStreets}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                setStreet(item);
                                setFilteredStreets([]);
                            }}>
                                <Text style={styles.streetItem}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.streetList}
                    />
                )}
                {fetchingStreets && <ActivityIndicator size="small" color="#0000ff" />}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Street Number</Text>
                <TextInput
                    style={styles.input}
                    value={streetNumber?.toString()}
                    onChangeText={(text) => setStreetNumber(parseInt(text))}
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
        maxWidth: 400,
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
    streetItem: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    streetList: {
        maxHeight: 200,
    },
});

export default ManagerSettingsScreen;
