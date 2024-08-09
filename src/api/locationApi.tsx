import axios from 'axios';
import { City, Country,  Street} from 'src/models';

const API_KEY = 'NVhCVTR4QWRRUUJIVmtWTVlsR0dRMmxHN3oxWXNUVUF1RVpkRk1tag=='; 
const BASE_URL = 'https://api.countrystatecity.in/v1';



export const getCountries = async (): Promise<Country[]> => {
  const response = await axios.get<Country[]>(
    `${BASE_URL}/countries`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      }
    }
  );
  return response.data.map(country => ({id: country.id, iso2: country.iso2, name: country.name }));
};

    export const getCities = async (countryCode: string): Promise<City[]> => {
  const response = await axios.get<City[]>(
    `${BASE_URL}/countries/${countryCode}/cities`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      }
    }
  );
  return response.data.map(city => ({ name: city.name, id: city.id }));
};
export const getStreets = async (city: string, country: string): Promise<Street[]> => {
  try {
    // Get bounding box for the city using Nominatim
    const nominatimResponse = await axios.get<any>(
        `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json&polygon_geojson=1`
    );

    if (!nominatimResponse.data.length) {
        throw new Error('City not found');
    }

    const cityDetails = nominatimResponse.data[0];
    const { boundingbox } = cityDetails;

    // Use Overpass API to get streets within the bounding box
    const overpassQuery = `
        [out:json];
        (
            way["highway"](${boundingbox[0]},${boundingbox[2]},${boundingbox[1]},${boundingbox[3]});
        );
        out body;
        >;
        out skel qt;
    `;

    const overpassResponse = await axios.post(
        'https://overpass-api.de/api/interpreter',
        overpassQuery,
        {
            headers: { 'Content-Type': 'text/plain' }
        }
    );

    const seenStreets = new Set<string>();
    const streets: Street[] = overpassResponse.data.elements
        .filter((element: any) => element.type === 'way' && element.tags.name)
        .map((element: any) => ({
            id: element.id,
            name: element.tags.name
        }))
        .filter((street: Street) => {
            if (seenStreets.has(street.name)) {
                return false;
            }
            seenStreets.add(street.name);
            return true;
        });

    return streets.sort((a: Street, b: Street) => a.name.localeCompare(b.name));
} catch (error) {
    console.error('Failed to fetch streets:', error);
    throw error;
}
};