import { getUserByUserName, getSupermarketById, getShopInventory, getShoppingListsByBuyerId, getOrdersByBuyerId, getSupermarketByUserId } from '../api/api';
import { fetchAndStoreData } from '../utils/fetchAndStoreData';
import { User, Supermarket, ShopInventory, ShoppingList, BuyerOrder } from '../models';

export const fetchSupermarketById = async (supermarketId: string): Promise<Supermarket | null> => {
  return await fetchAndStoreData('supermarketById', () => getSupermarketById(supermarketId));
};

export const fetchShopInventory = async (supermarketId: string): Promise<ShopInventory[]> => {
  return await fetchAndStoreData('ShopInventory', () => getShopInventory(supermarketId));
};

export const fetchShoppingListsByBuyerId = async (buyerId: string): Promise<ShoppingList[]> => {
  return await fetchAndStoreData('ShoppingLists', () => getShoppingListsByBuyerId(buyerId));
};

export const fetchOrdersByBuyerId = async (buyerId: string): Promise<BuyerOrder[]> => {
  return await fetchAndStoreData('BuyerOrders', () => getOrdersByBuyerId(buyerId));
};

export const fetchSupermarketByUserId = async (userId: string): Promise<Supermarket | null> => {
  return await fetchAndStoreData('supermarket', () => getSupermarketByUserId(userId));
};
