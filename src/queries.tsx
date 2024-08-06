import { User, BuyerOrder, ShoppingList, ShopInventory, Supermarket, ESP32Info, ShoppingListItem } from './models';

export interface QueryParam {
  name: string;
  type: string;
  value: any;
}

export interface Query {
  query: string;
  params: QueryParam[];
}

export const getShopInventoryQuery = (userId: string): Query => ({
  query: `
    SELECT si.* 
    FROM ShopInventory si
    JOIN Supermarket sm ON si.SupermarketID = sm.SupermarketID
    WHERE sm.UserID = @userId
  `,
  params: [
    { name: 'userId', type: 'UniqueIdentifier', value: userId }
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

export const getSupermarketByIdQuery = (supermarketID: string): Query => ({
  query: 'SELECT * FROM Supermarket WHERE SupermarketID = @supermarketId',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketID }
  ]
});

export const getSupermarketByUserIdQuery = (userId: string): Query => ({
  query: `
    SELECT sm.*
    FROM Supermarket sm
    WHERE sm.UserID = @userId
  `,
  params: [
    { name: 'userId', type: 'UniqueIdentifier', value: userId }
  ]
});
export const getSupermarketBybarcodeQuery = (barcode: string): Query => ({
  query: `
    SELECT sm.*
    FROM Supermarket sm
    WHERE sm.Barcode = @barcode
  `,
  params: [
    { name: 'barcode', type: 'NVarChar', value: barcode }
  ]
});

export const getShoppingListsByBuyerIdQuery = (buyerId: string): Query => ({
  query: 'SELECT * FROM ShoppingList WHERE BuyerID = @buyerId',
  params: [
    { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
  ]
});
export const deleteShoppingListQuery = (listId: string): Query => ({
  query: 'DELETE FROM ShoppingList WHERE ListID = @listId',
  params: [
    { name: 'listId', type: 'UniqueIdentifier', value: listId }
  ]
});
export const getShoppingListItemsByListIdQuery = (listId: string): Query => ({
  query: 'SELECT * FROM ShoppingListItem WHERE ListID = @listId',
  params: [
    { name: 'listId', type: 'UniqueIdentifier', value: listId }
  ]
});

export const updateShoppingListItemsQuery = (listId: string, items: ShoppingListItem[]): Query => ({
  query: `BEGIN TRANSACTION;
            DELETE FROM ShoppingListItem WHERE ListID = @listId;

            INSERT INTO ShoppingListItem (ItemID, ListID, ItemName, Quantity)
            VALUES ${items.map((_, index) => `(NEWID(), @listId, @itemName${index}, @quantity${index})`).join(", ")};

            COMMIT;`,
  params: [
    { name: 'listId', type: 'UniqueIdentifier', value: listId },
    ...items.flatMap((item, index) => [
      { name: `itemName${index}`, type: 'NVarChar', value: item.ItemName },
      { name: `quantity${index}`, type: 'Int', value: item.Quantity },
    ]),
  ],
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
export const getItemBySupermarketIdAndItemNameQuery = (supermarketId: string, ItemName: string): Query => ({
  query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND ItemName = @ItemName',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
    { name: 'ItemName', type: 'NVarChar', value: ItemName }
  ]
});

export const addShopInventoryQuery = (inventory: ShopInventory): Query => ({
  query: `
    INSERT INTO ShopInventory (SupermarketID, ItemName, Quantity, Price, Discount, Location, Barcode)
    OUTPUT inserted.InventoryID
    VALUES (@supermarketId, @ItemName, @quantity, @price, @discount, @location, @barcode)
  `,
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: inventory.SupermarketID },
    { name: 'ItemName', type: 'NVarChar', value: inventory.ItemName },
    { name: 'quantity', type: 'Int', value: inventory.Quantity },
    { name: 'price', type: 'Decimal', value: inventory.Price },
    { name: 'discount', type: 'Decimal', value: inventory.Discount },
    { name: 'location', type: 'NVarChar', value: inventory.Location },
    { name: 'barcode', type: 'NVarChar', value: inventory.Barcode }
  ]
});
export const updateShopInventoryQuery = (inventory: ShopInventory): Query => ({
  query: `IF EXISTS (SELECT * FROM ShopInventory WHERE InventoryID = @inventoryId)
            UPDATE ShopInventory
            SET SupermarketID = @supermarketId, ItemName = @ItemName, Quantity = @quantity, Price = @price, Discount = @discount, Location = @location, Barcode = @barcode
            WHERE InventoryID = @inventoryId`,
  params: [
    { name: 'inventoryId', type: 'UniqueIdentifier', value: inventory.InventoryID },
    { name: 'supermarketId', type: 'UniqueIdentifier', value: inventory.SupermarketID },
    { name: 'ItemName', type: 'NVarChar', value: inventory.ItemName },
    { name: 'quantity', type: 'Int', value: inventory.Quantity },
    { name: 'price', type: 'Decimal', value: inventory.Price },
    { name: 'discount', type: 'Decimal', value: inventory.Discount },
    { name: 'location', type: 'Int', value: inventory.Location },
    { name: 'barcode', type: 'NVarChar', value: inventory.Barcode }
  ]
});
export const deleteShopInventoryQuery = (inventoryId: string): Query => ({
  query: `DELETE FROM ShopInventory WHERE InventoryID = @inventoryId`,
  params: [
    { name: 'inventoryId', type: 'UniqueIdentifier', value: inventoryId }
  ]
});


export const getItemBySupermarketIdAndBarcodeQuery = (supermarketId: string, barcode: string): Query => ({
  query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND Barcode = @barcode',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
    { name: 'barcode', type: 'NVarChar', value: barcode }
  ]
});
export const getESP32DataQuery = (supermarketId: string): Query => ({
  query: 'SELECT * FROM ESP32Info WHERE SupermarketID = @supermarketId',
  params: [
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId }
  ]
});

export const addOrUpdateESP32DataQuery = (esp32Data: ESP32Info,supermarketId: string): Query => ({
  query: `IF EXISTS (SELECT * FROM ESP32Info WHERE ESP32ID = @esp32Id)
            UPDATE ESP32Info
            SET SupermarketID = @supermarketId, SSID = @ssid, Location = @location
            WHERE ESP32ID = @esp32Id
          ELSE
            INSERT INTO ESP32Info (ESP32ID, SupermarketID, SSID, Location)
            VALUES (@esp32Id, @supermarketId, @ssid, @location)`,
  params: [
    { name: 'esp32Id', type: 'UniqueIdentifier', value: esp32Data.Esp32Id },
    { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId},
    { name: 'ssid', type: 'NVarChar', value: esp32Data.Ssid },
    { name: 'location', type: 'NVarChar', value: JSON.stringify(esp32Data.Location) }
  ]
});

export const createShoppingListQuery = (listName: string, userId: string): Query => ({
  query: `INSERT INTO ShoppingList (ListName, BuyerID) 
          OUTPUT inserted.ListID 
          VALUES (@listName, @userId)`,
  params: [
    { name: 'listName', type: 'NVarChar', value: listName },
    { name: 'userId', type: 'UniqueIdentifier', value: userId },
  ]
});

export const changeShoppingListQuery = (listName: string, listId: string): Query => ({
  query: `UPDATE ShoppingList
          SET ListName = @listName
          WHERE ListID = @listId`,
  params: [
    { name: 'listName', type: 'NVarChar', value: listName },
    { name: 'listId', type: 'UniqueIdentifier', value: listId },
  ]
});