import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// קבלת מלאי
export const getInventory = async () => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data;
};

// עדכון מלאי
export const updateInventory = async (inventoryItem: { id: number; name: string; quantity: number }) => {
  const response = await axios.post(`${API_URL}/inventory`, inventoryItem);
  return response.data;
};

// קבלת עגלת קניות של משתמש קצה
export const getCart = async (userId: string) => {
  const response = await axios.get(`${API_URL}/cart/${userId}`);
  return response.data;
};

// עדכון עגלת קניות של משתמש קצה
export const updateCart = async (cart: { userId: string; items: { id: number; name: string; quantity: number }[] }) => {
  const response = await axios.post(`${API_URL}/cart`, cart);
  return response.data;
};
