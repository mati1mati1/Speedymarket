import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket } from './models';

export interface QueryParam {
  name: string;
  type: string;
  value: any;
}

export interface Query {
  query: string;
  params: QueryParam[];
}

export const getShopInventoryQuery = (supermarketId: string): Query => ({
  query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId }
  ]
});

export const getUserByIdQuery = (userId: string): Query => ({
  query: 'SELECT * FROM [User] WHERE UserID = @userId',
  params: [
    { name: 'userId', type: 'UniqueIdentifier', value: userId }
  ]
});

export const getUserByUserNameQuery = (userName: string): Query => ({
  query: 'SELECT * FROM [User] WHERE UserName = @userName',
  params: [
    { name: 'userName', type: 'NVarChar', value: userName }
  ]
});

export const getMapBySupermarketIdQuery = (supermarketId: string): Query => ({
  query: 'SELECT * FROM Supermarket WHERE SupermarketID = @supermarketId',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId }
  ]
});

export const updateMapQuery = (supermarketId: string, BranchMap: string): Query => ({
  query: 'UPDATE Supermarket SET BranchMap = @BranchMap WHERE SupermarketID = @supermarketId',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
    { name: 'BranchMap', type: 'NVarChar', value: BranchMap }
  ]
});

export const getSupermarketByIdQuery = (supermarketId: string): Query => ({
  query: 'SELECT * FROM Supermarket WHERE SupermarketID = @supermarketId',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId }
  ]
});

export const getSupermarketByUserIdQuery = (userId: string): Query => ({
  query: 'SELECT * FROM Supermarket WHERE UserId = @supermarketId',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: userId }
  ]
});

export const getShoppingListsByBuyerIdQuery = (buyerId: string): Query => ({
  query: 'SELECT * FROM ShoppingList WHERE BuyerID = @buyerId',
  params: [
    { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
  ]
});

export const addOrUpdateShoppingListByBuyerIdQuery = (listId: string, buyerId: string, items: string): Query => ({
  query: `IF EXISTS (SELECT * FROM ShoppingList WHERE ListID = @listId)
            UPDATE ShoppingList SET Items = @items WHERE ListID = @listId
          ELSE
            INSERT INTO ShoppingList (ListID, BuyerID, Items) VALUES (@listId, @buyerId, @items)`,
  params: [
    { name: 'listId', type: 'UniqueIdentifier', value: listId },
    { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId },
    { name: 'items', type: 'NVarChar', value: items }
  ]
});

export const getOrdersByBuyerIdQuery = (buyerId: string): Query => ({
  query: 'SELECT * FROM BuyerOrder WHERE BuyerID = @buyerId',
  params: [
    { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
  ]
});

export const getSupermarketsQuery = (): Query => ({
  query: 'SELECT * FROM Supermarket',
  params: []
});
export const getItemBySupermarketIdAndItemNumberQuery = (supermarketId: string, itemNumber: string): Query => ({
  query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND ItemNumber = @itemNumber',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
    { name: 'itemNumber', type: 'NVarChar', value: itemNumber }
  ]
});

export const addOrUpdateShopInventoryQuery = (inventory: ShopInventory): Query => ({
  query: `IF EXISTS (SELECT * FROM ShopInventory WHERE InventoryID = @inventoryId)
            UPDATE ShopInventory
            SET SupermarketID = @supermarketId, ItemNumber = @itemNumber, Quantity = @quantity, Price = @price, Discount = @discount, Location = @location, Barcode = @barcode
            WHERE InventoryID = @inventoryId
          ELSE
            INSERT INTO ShopInventory (InventoryID, SupermarketID, ItemNumber, Quantity, Price, Discount, Location, Barcode)
            VALUES (@inventoryId, @supermarketId, @itemNumber, @quantity, @price, @discount, @location, @barcode)`,
  params: [
    { name: 'inventoryId', type: 'UniqueIdentifier', value: inventory.InventoryID },
    { name: 'supermarketId', type: 'UniqueIdentifier', value: inventory.SupermarketID },
    { name: 'itemNumber', type: 'NVarChar', value: inventory.ItemNumber },
    { name: 'quantity', type: 'Int', value: inventory.Quantity },
    { name: 'price', type: 'Decimal', value: inventory.Price },
    { name: 'discount', type: 'Decimal', value: inventory.Discount },
    { name: 'location', type: 'Int', value: inventory.Location },
    { name: 'barcode', type: 'NVarChar', value: inventory.Barcode }
  ]
});

export const getItemBySupermarketIdAndBarcodeQuery = (supermarketId: string, barcode: string): Query => ({
  query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND Barcode = @barcode',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
    { name: 'barcode', type: 'NVarChar', value: barcode }
  ]
});