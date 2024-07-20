import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const fetchAndStoreData = async (key: string, fetchFunction: () => Promise<any>) => {
    try {
      let data = JSON.parse(await AsyncStorage.getItem(key) || 'null');
      if (data === null) {
        data = await fetchFunction();
        AsyncStorage.setItem(key, JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error(`Failed to fetch data for key: ${key}`, error);
      throw error;
    }
  };
  