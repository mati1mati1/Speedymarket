import { getUserByUserName, getSupermarketById, getShopInventory, getShoppingListsByBuyerId, getOrdersByBuyerId, getSupermarketByUserId } from '../api/api';
import { fetchAndStoreData } from '../utils/fetchAndStoreData';
import { User, Supermarket, ShopInventory, ShoppingList, BuyerOrder } from '../models';


export const fetchgetSupermarketByIdById = async (userId: string): Promise<Supermarket | null> => {
  return await fetchAndStoreData('getSupermarketById', () => getSupermarketById(userId));
};

export const fetchShopInventory = async (userId: string): Promise<ShopInventory[]> => {
  return await fetchAndStoreData('ShopInventory', () => getShopInventory(userId));
};

export const fetchShoppingListsByBuyerId = async (userId: string): Promise<ShoppingList[]> => {
  return await fetchAndStoreData('ShoppingLists', () => getShoppingListsByBuyerId(userId));
};

export const fetchOrdersByBuyerId = async (userId: string): Promise<BuyerOrder[]> => {
  return await fetchAndStoreData('BuyerOrder', () => getOrdersByBuyerId(userId));
};

export const fetchSupermarketByUserId = async (userId: string): Promise<Supermarket | null> => {
    return await fetchAndStoreData('supermarket',() => getSupermarketByUserId(userId));
  };