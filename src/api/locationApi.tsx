import axios from 'axios';
import { CityResponse, CountryResponse } from 'src/models';

const API_KEY = 'YOUR_COUNTRYSTATECITY_API_KEY'; // Replace with your CountryStateCity API key
const BASE_URL = 'https://api.countrystatecity.in/v1';



export const getCountries = async (): Promise<string[]> => {
  const response = await axios.get<CountryResponse[]>(
    `${BASE_URL}/countries`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      }
    }
  );
  return response.data.map(country => country.name);
};

export const getCities = async (countryCode: string): Promise<string[]> => {
  const response = await axios.get<CityResponse[]>(
    `${BASE_URL}/countries/${countryCode}/cities`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      }
    }
  );
  return response.data.map(city => city.name);
};
