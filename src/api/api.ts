import axios from 'axios';
import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket, ShoppingListItem, OrderItem, SupplierOrder, SupplierInventory } from '../models';
import { getToken } from 'src/context/AuthContext'; 

export const executeDbFunction = async <T>(functionName: string, params: Record<string, any>): Promise<T> => {
  const token = await getToken();
  try {
    // const response = await axios.post<T>('https://speedymarketbackend1.azurewebsites.net/api/ExecuteSqlQuery?', {
      const response = await axios.post<T>('https://executesqlquery1.azurewebsites.net/api/HttpTrigger1?', {
      functionName,
      params
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error executing function:', error);
    throw error;
  }
};
export const executePaymentFunction = async <T>(amount: string, paymentType: string, items: ShopInventory[]): Promise<T> => {
  const token = await getToken();
  try {
    const response = await axios.post<T>('https://speedymarketbackend1.azurewebsites.net/api/Payment?', {
      amount,
      paymentType,
      items
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error executing function:', error);
    throw error;
  }
};
// Example usage
export const getUserById = async (): Promise<User[]> => {
  return await executeDbFunction<User[]>( 'getUserById', {});
};

export const getUserByUserName = async ( userName: string): Promise<User | null> => {
  return await executeDbFunction<User | null>( 'getUserByUserName', { userName });
};

export const getItemBySupermarketIdAndItemName = async ( supermarketId: string, ItemName: string): Promise<ShopInventory[]> => {
  return await executeDbFunction<ShopInventory[]>( 'getItemBySupermarketIdAndItemName', { supermarketId, ItemName });
};

export const getItemBySupermarketIdAndBarcode = async ( supermarketId: string, barcode: string): Promise<ShopInventory[]> => {
  return await executeDbFunction<ShopInventory[]>( 'getItemBySupermarketIdAndBarcode', { supermarketId, barcode });
};

export const updateUserInfo = async (name: string, lastName: string, email: string, phoneNumber: string): Promise<void> => {
  await executeDbFunction<void>('updateUserInfo', { name, lastName, email, phoneNumber });
};

export const getMapBySupermarketId = async ( supermarketId: string): Promise<string[]> => {
  return await executeDbFunction<string[]>( 'getMapBySupermarketId', { supermarketId });
};
export const getOrderDetailsByOrderId = async ( orderId: string): Promise<OrderItem[]> => {
  return await executeDbFunction<OrderItem[]>( 'getOrderDetailsById', { orderId });
};
export const getOrderByBuyerIdOrderId = async ( orderId: string): Promise<BuyerOrder> => {
  return await executeDbFunction<BuyerOrder>( 'getOrderByBuyerIdAndOrderId', { orderId });
};


export const updateMap = async ( supermarketId: string, BranchMap: string): Promise<string[]> => {
  return await executeDbFunction<string[]>( 'updateMap', { supermarketId, BranchMap });
};

export const getSupermarketByUserId = async (): Promise<Supermarket[]> => {
  return await executeDbFunction<Supermarket[]>( 'getSupermarketByUserId', {});
};

export const registerUser = async ( name: string, lastName:string, userName: string, password: string, email: string, phone: string): Promise<void> => {
  await executeDbFunction<void>('registerUser', { name, lastName, userName, password, email, phone });
}

export const updateSupermarketDetails = async (supermarket: Supermarket): Promise<void> => {
  await executeDbFunction<void>('updateSupermarketDetailsQuery', supermarket);
};
export const getSupermarketBySupermarketId = async ( supermarketId: string): Promise<Supermarket[]> => {
  return await executeDbFunction<Supermarket[]>( 'getSupermarketBySupermarketId', { supermarketId });
};

export const getSupermarketByBarcode = async ( barcode: string): Promise<Supermarket[]> => {
  return await executeDbFunction<Supermarket[]>( 'getSupermarketByBarcode', { barcode });
};

export const deleteShoppingList = async ( listId: string): Promise<void> => {
  return await executeDbFunction<void>( 'deleteShoppingList', { listId });
};

export const getShoppingListsByBuyerId = async (): Promise<ShoppingList[]> => {
  return await executeDbFunction<ShoppingList[]>( 'getShoppingListsByBuyerId', {});
};

export const getShoppingListItemByCardId = async ( listId: string): Promise<ShoppingListItem[]> => {
  return await executeDbFunction<ShoppingListItem[]>( 'getShoppingListItemsByListId', { listId });
};

export const getShopInventory = async (): Promise<ShopInventory[]> => {
  return await executeDbFunction<ShopInventory[]>( 'getShopInventory', {});
};

export const updateShoppingListItems = async ( listId: string, items: ShoppingListItem[]): Promise<void> => {
  return await executeDbFunction<void>( 'updateShoppingListItems', { listId, items });
};

export const getOrdersByBuyerId = async (): Promise<BuyerOrder[]> => {
  return await executeDbFunction<BuyerOrder[]>( 'getOrdersByBuyerId', {});
};

export const getSupermarkets = async (): Promise<Supermarket[]> => {
  return await executeDbFunction<Supermarket[]>( 'getSupermarkets', {});
};

export const createShoppingList = async ( listName: string): Promise<ShoppingList[]> => {
  return await executeDbFunction<ShoppingList[]>( 'createShoppingList', { listName });
};

export const createPurchaseQuery = async ( items: ShopInventory[], supermarketId: string,sessionId: string | null, totalAmount: string): Promise<string> => {
  const response = await executeDbFunction<{ OrderID: string }[]>(
    'createPurchaseQuery', 
    { items, supermarketId, sessionId, totalAmount }
  );

  if (response && response.length > 0) {
    return response[0].OrderID;
  } else {
    throw new Error('OrderID not found');
  }
};

export const changeShoppingListName = async ( listName: string, listId: string): Promise<ShoppingList[]> => {
  return await executeDbFunction<ShoppingList[]>( 'changeShoppingListName', { listName, listId });
};

export const getShopInventoryByItemName = async ( itemName: string ): Promise<ShopInventory[]> => {
  return await executeDbFunction<ShopInventory[]>( 'getShopInventoryByItemName', {itemName});
};

export const addShopInventory = async ( shopInventory: ShopInventory): Promise<string> => {
  return await executeDbFunction<string>( 'addShopInventory', { shopInventory });
};

export const updateShopInventory = async ( shopInventory: ShopInventory): Promise<void> => {
  return await executeDbFunction<void>( 'updateShopInventory', { shopInventory });
};

export const updateShopInventoryQuantityQuery = async (shopInventory: ShopInventory): Promise<void> => {
  return await executeDbFunction<void>( 'updateShopInventoryQuantityQuery', {shopInventory});
};

export const deleteShopInventory = async ( inventoryId: string): Promise<void> => {
  return await executeDbFunction<void>( 'deleteShopInventory', { inventoryId });
};

export const getOrdersBySupplierId = async (): Promise<SupplierOrder[]> => {
  return await executeDbFunction<SupplierOrder[]>( 'getOrdersBySupplierId', {});
};

export const getOrdersBySupermarketIdAndUserTypeSupplierQuery = async ( supermarketId: string): Promise<SupplierOrder[]> => {
  return await executeDbFunction<SupplierOrder[]>( 'getOrdersBySupermarketIdAndUserTypeSupplierQuery', { supermarketId });
};

// export const getDetailsForSuperMarketOrder = async ( orderId: string): Promise<SupplierOrder> => {
//   return await executeDbFunction<SupplierOrder>( 'getDetailsForSuperMarketOrder', { orderId });
// }

export const updateOrderStatus = async ( orderId: string, orderStatus: string): Promise<void> => {
  return await executeDbFunction<void>( 'updateOrderStatus', { orderId, orderStatus });
};
export const getAllSuppliers = async (): Promise<User[]> => {
  return await executeDbFunction<User[]>('getAllSuppliers', {});
}

export const getSupplierInventory = async ( supplierId: string ): Promise<SupplierInventory[]> => {
  return await executeDbFunction<SupplierInventory[]>('getSupplierInventory', { supplierId });
}

export const createSuperMarketOrder = async ( supplierId: string, supermarketId: string, totalAmount: number, orderStatus: string, items: OrderItem[]): Promise<{ OrderID : string }[]> => {
    return await executeDbFunction<{ OrderID : string }[]>('createSuperMarketOrder', { supplierId, supermarketId, totalAmount, orderStatus, items });
}

interface AIResponse {
  success: boolean;
  list: string[];
}
export const uploadGroceryListImage = async (imageFile: Blob): Promise<AIResponse> => {
  try {
    const response = await axios.post('https://readimage.azurewebsites.net/api/readImage?', imageFile, {
      headers: {
        'Content-Type': 'application/octet-stream',
        // 'Accept': 'application/octet-stream',
      },
    });

    const data = response.data;
    if (data) {
      const lines = data.readResult.blocks[0].lines;
      const textLines = lines.map((line: { text: any; }) => line.text);
      return {
        success: true,
        list: textLines,
      };
    } else {
      return {
        success: false,
        list: [],
      };
    }
  } catch (error) {
    console.error('Error uploading grocery list image:', error);
    return {
      success: false,
      list: [],
    };
  }
};

export const uploadRecipeUrl = async (recipeUrl: string): Promise<AIResponse> => {
  const key = process.env.EXPO_PUBLIC_RECIPE_FUNCTION_KEY;
  // const key = '=='; // Ensure this is stored securely
  const url = `https://readimage.azurewebsites.net/api/readRecipeURL?code=${key}`;

  try {
    const response = await axios.post(url, { url: recipeUrl }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = response.data;
    if (data.success) {
      return {
        success: true,
        list: data.ingredients,
      };
    } else {
      return {
        success: false,
        list: [],
      };
    }
  } catch (error) {
    console.error('An error occurred during uploadRecipeUrl', error);
    return {
      success: false,
      list: [],
    };
  }
};

