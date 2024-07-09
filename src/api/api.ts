import axios from 'axios';
import { Query, getUserByIdQuery, getItemBySellerIdAndItemNumberQuery, getSellerByIdQuery, getShoppingListByBuyerIdQuery, addOrUpdateShoppingListByBuyerIdQuery, getOrdersByBuyerIdQuery } from '../queries';
import { User, BuyerOrder, ShoppingList, ShopInventory, Seller } from '../models';

const API_URL = 'http://localhost:7071/api/ExecuteSqlQuery';

export const executeSqlQuery = async <T>(queryObject: Query): Promise<T[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryObject),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
};

// API call functions
export const getUserById = async (userId: string): Promise<User[]> => {
  const queryObject = getUserByIdQuery(userId);
  return await executeSqlQuery<User>(queryObject);
};

export const getItemBySellerIdAndItemNumber = async (sellerId: string, itemNumber: string): Promise<ShopInventory[]> => {
  const queryObject = getItemBySellerIdAndItemNumberQuery(sellerId, itemNumber);
  return await executeSqlQuery<ShopInventory>(queryObject);
};

export const getSellerById = async (sellerId: string): Promise<Seller[]> => {
  const queryObject = getSellerByIdQuery(sellerId);
  return await executeSqlQuery<Seller>(queryObject);
};

export const getShoppingListByBuyerId = async (buyerId: string): Promise<ShoppingList[]> => {
  const queryObject = getShoppingListByBuyerIdQuery(buyerId);
  return await executeSqlQuery<ShoppingList>(queryObject);
};

export const addOrUpdateShoppingListByBuyerId = async (listId: string, buyerId: string, items: string): Promise<void> => {
  const queryObject = addOrUpdateShoppingListByBuyerIdQuery(listId, buyerId, items);
  await executeSqlQuery<void>(queryObject);
};

export const getOrdersByBuyerId = async (buyerId: string): Promise<BuyerOrder[]> => {
  const queryObject = getOrdersByBuyerIdQuery(buyerId);
  return await executeSqlQuery<BuyerOrder>(queryObject);
};
