import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SectionType {
    id: number;
    name: string;
    left: number;
    top: number;
    rotation: number;
    width: number;
    height: number;
  }

  export interface EntranceType {
    left: number;
    top: number;
  }

  export interface PathData {
    map: {
      sections: SectionType[];
      entrance: EntranceType;
    };
    path: number[][];
  }

  export const loadMapAndPath = async (supermarketId: string, listId: string): Promise<PathData> => {
    const token = await AsyncStorage.getItem('token'); 
    const response = await fetch('http://localhost:7071/api/calculatePath', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ supermarketId, listId })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error loading map and path');
    }
  };