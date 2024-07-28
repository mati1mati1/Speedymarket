import { Query, getUserByUserNameQuery, getUserByIdQuery, getMapBySupermarketIdQuery, updateMapQuery, getItemBySupermarketIdAndItemNameQuery, getItemBySupermarketIdAndBarcodeQuery, getSupermarketByIdQuery, getShoppingListsByBuyerIdQuery, addOrUpdateShoppingListByBuyerIdQuery, getOrdersByBuyerIdQuery, getSupermarketsQuery, getShopInventoryQuery, getSupermarketByUserIdQuery, getShoppingListItemsByListIdQuery } from '../queries';
import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket, ShoppingListItem } from '../models';
import { decodedToken } from '../utils/authUtils';
import axiosInstance from '../utils/axiosInstance';
import Button from '@components/Button';
export const executeSqlQuery = async <T>(queryObject: Query): Promise<T[]> => {
  try {
    const response = await axiosInstance.post<T[]>('', {
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
export const getUserById = async (token : string ): Promise<User[]> => {
  const userId = decodedToken(token)?.userId;
  if (!userId) {
    throw new Error('User ID not found in token');
  }
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

export const getItemBySupermarketIdAndItemName = async (supermarketId: string, ItemName: string): Promise<ShopInventory[]> => {
  const queryObject = getItemBySupermarketIdAndItemNameQuery(supermarketId, ItemName);
  return await executeSqlQuery<ShopInventory>(queryObject);
};

export const getItemBySupermarketIdAndBarcode = async (supermarketId: string, barcode: string): Promise<ShopInventory[]> => {
  const queryObject = getItemBySupermarketIdAndBarcodeQuery(supermarketId, barcode);
  return await executeSqlQuery<ShopInventory>(queryObject);
};

export const getMapBySupermarketId = async (supermarketId: string): Promise<string[]> => {
  const queryObject = getMapBySupermarketIdQuery(supermarketId);
  return await executeSqlQuery<string>(queryObject);
};

export const updateMap = async (supermarketId: string, BranchMap: string): Promise<string[]> => {
  const queryObject = updateMapQuery(supermarketId, BranchMap);
  return await executeSqlQuery<string>(queryObject);
};


export const getSupermarketByUserId = async (token : string ): Promise<Supermarket[]> => {
  const userId = decodedToken(token)?.userId
  if (!userId) {
    throw new Error('User ID not found in token');
  }
  const queryObject = getSupermarketByUserIdQuery(userId);
  return await executeSqlQuery<Supermarket>(queryObject);
};
export const getSupermarketBySupermarketID = async (supermarketID : string ): Promise<Supermarket[]> => {
  const queryObject = getSupermarketByUserIdQuery(supermarketID);
  return await executeSqlQuery<Supermarket>(queryObject);
};

export const getShoppingListsByBuyerId = async (token : string ): Promise<ShoppingList[]> => {
  const userId = decodedToken(token)?.userId
  if (!userId) {
    throw new Error('User ID not found in token');
  }
  const queryObject = getShoppingListsByBuyerIdQuery(userId);
  return await executeSqlQuery<ShoppingList>(queryObject);
};
export const getShoppingListItemByCardId = async (listId : string): Promise<ShoppingListItem[]> => {
  const queryObject = getShoppingListItemsByListIdQuery(listId);
  return await executeSqlQuery<ShoppingListItem>(queryObject);
};

export const getShopInventory = async (token : string ): Promise<ShopInventory[]> => {
  const userId = decodedToken(token)?.userId
  if (!userId) {
    throw new Error('User ID not found in token');
  }
  const queryObject = getShopInventoryQuery(userId);
  return await executeSqlQuery<ShopInventory>(queryObject);
};

export const addOrUpdateShoppingListByBuyerId = async (listId: string, items: string,token : string): Promise<void> => {
  const userId = decodedToken(token)?.userId
  if (!userId) {
    throw new Error('User ID not found in token');
  }
  const queryObject = addOrUpdateShoppingListByBuyerIdQuery(listId, userId, items);
  await executeSqlQuery<void>(queryObject);
};

export const getOrdersByBuyerId = async (token : string): Promise<BuyerOrder[]> => {
  const userId = decodedToken(token)?.userId
  if (!userId) {
    throw new Error('User ID not found in token');
  }
  const queryObject = getOrdersByBuyerIdQuery(userId);
  return await executeSqlQuery<BuyerOrder>(queryObject);
};

export const getSupermarkets = async (): Promise<Supermarket[]> => {
  debugger
  const queryObject = getSupermarketsQuery();
  return await executeSqlQuery<Supermarket>(queryObject);
};
