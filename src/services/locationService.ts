import WifiManager from 'react-native-wifi-reborn';
import axios from 'axios';

export const fetchCurrentLocation = async (supermarketId: string): Promise<{ x: number; y: number } | undefined> => {
  if (!WifiManager || !WifiManager.loadWifiList) {
    console.error('WifiManager is undefined or loadWifiList function does not exist');
    return undefined;
  }
  const networks = await WifiManager.loadWifiList();
  const wifiData = networks.map(network => ({
    ssid: network.SSID,
    rssi: network.level,
  }));

  const response = await axios.post('http://localhost:7071/api/calculateLocation', {
    supermarketId,
    wifiData
  });

  if (response.status === 200) {
    return response.data.location;
  } else {
    throw new Error('Error fetching location');
  }
};