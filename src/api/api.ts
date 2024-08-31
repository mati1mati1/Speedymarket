import axios from 'axios';
import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket, ShoppingListItem } from '../models';

export const executeFunction = async <T>(functionName: string, params: Record<string, any>): Promise<T> => {
  try {
    const response = await axios.post<T>('http://localhost:7071/api/ExecuteSqlQuery', {
      functionName,
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error executing function:', error);
    throw error;
  }
};

// Example usage
export const getUserById = async (): Promise<User[]> => {
  return await executeFunction<User[]>( 'getUserById', {});
};

export const getUserByUserName = async ( userName: string): Promise<User | null> => {
  return await executeFunction<User | null>( 'getUserByUserName', { userName });
};

export const getItemBySupermarketIdAndItemName = async ( supermarketId: string, ItemName: string): Promise<ShopInventory[]> => {
  return await executeFunction<ShopInventory[]>( 'getItemBySupermarketIdAndItemName', { supermarketId, ItemName });
};

export const getItemBySupermarketIdAndBarcode = async ( supermarketId: string, barcode: string): Promise<ShopInventory[]> => {
  return await executeFunction<ShopInventory[]>( 'getItemBySupermarketIdAndBarcode', { supermarketId, barcode });
};

export const getMapBySupermarketId = async ( supermarketId: string): Promise<string[]> => {
  return await executeFunction<string[]>( 'getMapBySupermarketId', { supermarketId });
};

export const updateMap = async ( supermarketId: string, BranchMap: string): Promise<string[]> => {
  return await executeFunction<string[]>( 'updateMap', { supermarketId, BranchMap });
};

export const getSupermarketByUserId = async (): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>( 'getSupermarketByUserId', {});
};

export const updateSupermarketDetails = async (supermarket: Supermarket): Promise<void> => {
  await executeFunction<void>('updateSupermarketDetailsQuery', supermarket);
};
export const getSupermarketBySupermarketId = async ( supermarketId: string): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>( 'getSupermarketBySupermarketId', { supermarketId });
};

export const getSupermarketByBarcode = async ( barcode: string): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>( 'getSupermarketByBarcode', { barcode });
};

export const deleteShoppingList = async ( listId: string): Promise<void> => {
  return await executeFunction<void>( 'deleteShoppingList', { listId });
};

export const getShoppingListsByBuyerId = async (): Promise<ShoppingList[]> => {
  return await executeFunction<ShoppingList[]>( 'getShoppingListsByBuyerId', {});
};

export const getShoppingListItemByCardId = async ( listId: string): Promise<ShoppingListItem[]> => {
  return await executeFunction<ShoppingListItem[]>( 'getShoppingListItemsByListId', { listId });
};

export const getShopInventory = async (): Promise<ShopInventory[]> => {
  return await executeFunction<ShopInventory[]>( 'getShopInventory', {});
};

export const updateShoppingListItems = async ( listId: string, items: ShoppingListItem[]): Promise<void> => {
  return await executeFunction<void>( 'updateShoppingListItems', { listId, items });
};

export const getOrdersByBuyerId = async (): Promise<BuyerOrder[]> => {
  return await executeFunction<BuyerOrder[]>( 'getOrdersByBuyerId', {});
};

export const getSupermarkets = async (): Promise<Supermarket[]> => {
  return await executeFunction<Supermarket[]>( 'getSupermarkets', {});
};

export const createShoppingList = async ( listName: string): Promise<ShoppingList[]> => {
  return await executeFunction<ShoppingList[]>( 'createShoppingList', { listName });
};

export const changeShoppingListName = async ( listName: string, listId: string): Promise<ShoppingList[]> => {
  return await executeFunction<ShoppingList[]>( 'changeShoppingListName', { listName, listId });
};

export const addShopInventory = async ( shopInventory: ShopInventory): Promise<string> => {
  return await executeFunction<string>( 'addShopInventory', { shopInventory });
};

export const updateShopInventory = async ( shopInventory: ShopInventory): Promise<void> => {
  return await executeFunction<void>( 'updateShopInventory', { shopInventory });
};

export const deleteShopInventory = async ( inventoryId: string): Promise<void> => {
  return await executeFunction<void>( 'deleteShopInventory', { inventoryId });
};

  
interface AIResponse {
  success: boolean;
  list: string[];
}
export const uploadGroceryListImage = async (imageFile: string): Promise<AIResponse> => {
  console.log("this is the image file", imageFile);
  const response = await fetch('https://readimage.azurewebsites.net/api/readImage?', {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    body: imageFile,
  });
  const data = await response.json();
  if (data) {
    const lines = data.readResult.blocks[0].lines
    const textLines = lines.map((line: { text: any; }) => line.text)
    return {
      success: true,
      list: textLines,
    };
  } else {
    return {
      success: false,
      list: JSON.parse(""),
    };
  }
}

export const uploadRecipeUrl = async (recipeUrl: string): Promise<AIResponse>=>{
  const response = await fetch("", {
    method: 'POST',
    body: recipeUrl
  });
  const data = await response.json();
  if (data){
    console.log(data);
  }
  return {
    success: false,
    list: JSON.parse(""),
  };
}