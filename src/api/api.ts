import { Query, getUserByUserNameQuery, getUserByIdQuery, getMapBySupermarketIdQuery, updateMapQuery, getItemBySupermarketIdAndItemNameQuery, getItemBySupermarketIdAndBarcodeQuery, getSupermarketByIdQuery, getShoppingListsByBuyerIdQuery, getOrdersByBuyerIdQuery, getSupermarketsQuery, getShopInventoryQuery, getSupermarketByUserIdQuery, getShoppingListItemsByListIdQuery, updateShoppingListItemsQuery, createShoppingListQuery, changeShoppingListQuery, addShopInventoryQuery, updateShopInventoryQuery, getSupermarketBybarcodeQuery, deleteShoppingListQuery, deleteShopInventoryQuery } from '../queries';
import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket, ShoppingListItem } from '../models';
import { decodedToken } from '../utils/authUtils';
import axiosInstance from '../utils/axiosInstance';
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

//this is when the user scans the barcode
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
export const getSupermarketByBarcode = async (barcode : string ): Promise<Supermarket[]> => {
  const queryObject = getSupermarketBybarcodeQuery(barcode);
  return await executeSqlQuery<Supermarket>(queryObject);
};

export const deleteShoppingList = async (listId: string, token: string): Promise<void> => {
  const queryObject = deleteShoppingListQuery(listId);
  await executeSqlQuery<void>(queryObject);
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

export const updateShoppingListItems = async (listId: string, items: ShoppingListItem []): Promise<void> => {
  const queryObject = updateShoppingListItemsQuery(listId, items);
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
  const queryObject = getSupermarketsQuery();
  return await executeSqlQuery<Supermarket>(queryObject);
};
export const createShoppingList = async (listName: string,token : string): Promise<ShoppingList[]> => {
  const userId = decodedToken(token)?.userId
  if (!userId) {
    throw new Error('User ID not found in token');
  }
  const queryObject = createShoppingListQuery(listName,userId);
  return await executeSqlQuery<ShoppingList>(queryObject);
};
export const changeShoppingListName = async (listName: string,listId : string): Promise<ShoppingList[]> => {
  const queryObject = changeShoppingListQuery(listName, listId);
  return await executeSqlQuery<ShoppingList>(queryObject);
};

export const addShopInventory = async (shopInventory: ShopInventory): Promise<string> => {
  const queryObject = addShopInventoryQuery(shopInventory);
  const result = await executeSqlQuery<{ InventoryID: string }>(queryObject);
  return result[0].InventoryID;
};

export const updateShopInventory = async (shopInventory: ShopInventory): Promise<void> => {
  const queryObject = updateShopInventoryQuery(shopInventory);
  await executeSqlQuery<void>(queryObject);
};

export const deleteShopInventory = async (inventoryId: string): Promise<void> => {
  const queryObject = deleteShopInventoryQuery(inventoryId);
  await executeSqlQuery<void>(queryObject);
};
