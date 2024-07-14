import axios from 'axios';
import { Query,getUserByUserNameQuery, getUserByIdQuery,getMapBySellerIdQuery, updateMapQuery, getItemBySellerIdAndItemNumberQuery, getSellerByIdQuery, getShoppingListsByBuyerIdQuery, addOrUpdateShoppingListByBuyerIdQuery, getOrdersByBuyerIdQuery, getSupermarketsQuery } from '../queries';
import { User, BuyerOrder, ShoppingList, ShopInventory, Seller } from '../models';

const API_URL = 'http://localhost:7071/api/ExecuteSqlQuery';

export const executeSqlQuery = async <T>(queryObject: Query): Promise<T[]> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      query: queryObject.query,
      params: queryObject.params
    });
    return response.data;
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
export const getUserByUserName = async (userName: string): Promise<User | null> => {
  const queryObject = getUserByUserNameQuery(userName);
  const users = await executeSqlQuery<User>(queryObject);

  if (users.length > 0) {
    return users[0];
  } else {
    return null;
  }
};

export const getItemBySellerIdAndItemNumber = async (sellerId: string, itemNumber: string): Promise<ShopInventory[]> => {
  const queryObject = getItemBySellerIdAndItemNumberQuery(sellerId, itemNumber);
  return await executeSqlQuery<ShopInventory>(queryObject);
};
export const getMapBySellerId = async (sellerId: string): Promise<string[]> => {
  const queryObject = getMapBySellerIdQuery(sellerId);
  return await executeSqlQuery<string>(queryObject);
};
export const updateMap = async (sellerId: string, BranchMap: string): Promise<string[]> => {
  const queryObject = updateMapQuery(sellerId,BranchMap);
  return await executeSqlQuery<string>(queryObject);
};

export const getSellerById = async (sellerId: string): Promise<Seller[]> => {
  const queryObject = getSellerByIdQuery(sellerId);
  return await executeSqlQuery<Seller>(queryObject);
};

export const getShoppingListsByBuyerId = async (buyerId: string): Promise<ShoppingList[]> => {
  const queryObject = getShoppingListsByBuyerIdQuery(buyerId);
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

export const getSupermarkets = async (): Promise<Seller[]> => {
  const queryObject = getSupermarketsQuery();
  return await executeSqlQuery<Seller>(queryObject);
};

