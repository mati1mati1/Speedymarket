const getUserByIdQuery = (userId) => ({
    query: 'SELECT * FROM [User] WHERE UserID = @userId',
    params: [
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]
  });
  
  const getUserByUserNameQuery = (userName) => ({
    query: 'SELECT * FROM [User] WHERE UserName = @userName',
    params: [
      { name: 'userName', type: 'NVarChar', value: userName }
    ]
  });
  
  const getShopInventoryQuery = (userId) => ({
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
  const getOrderDetailsByIdQuery = (orderId) => ({
    query: `
      SELECT *
      FROM OrderItem
      WHERE OrderID = @orderId
    `,
    params: [
      { name: 'orderId', type: 'UniqueIdentifier', value: orderId }
    ]
  });
  const getItemBySupermarketIdAndItemNameQuery = (supermarketId, ItemName) => ({
    query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND ItemName = @ItemName',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'ItemName', type: 'NVarChar', value: ItemName }
    ]
  });
  
  const getItemBySupermarketIdAndBarcodeQuery = (supermarketId, barcode) => ({
    query: 'SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId AND Barcode = @barcode',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'barcode', type: 'NVarChar', value: barcode }
    ]
  });

  const updateSupermarketDetailsQuery = (supermarket) => ({
    query: `
      UPDATE Supermarket
      SET BranchName = @branchName,
          BranchMap = @branchMap,
          StreetNumber = @streetNumber,
          Street = @street,
          City = @city,
          Country = @country,
          WiFiSSID = @wifiSSID,
          WiFiPassword = @wifiPassword,
          OperatingHours = @operatingHours,
          Latitude = @latitude,
          Longitude = @longitude
          WHERE SupermarketID = @supermarketId
          `,
          params: [
            { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarket.SupermarketID },
            { name: 'branchName', type: 'NVarChar', value: supermarket.BranchName },
            { name: 'branchMap', type: 'NVarChar', value: supermarket.BranchMap },
            { name: 'streetNumber', type: 'Int', value: supermarket.StreetNumber },
            { name: 'street', type: 'NVarChar', value: JSON.stringify(supermarket.Street) },
            { name: 'city', type: 'NVarChar', value: JSON.stringify(supermarket.City) },
            { name: 'country', type: 'NVarChar', value: JSON.stringify(supermarket.Country) },
            { name: 'wifiSSID', type: 'NVarChar', value: supermarket.WiFiSSID },
            { name: 'wifiPassword', type: 'NVarChar', value: supermarket.WiFiPassword },
            { name: 'operatingHours', type: 'NVarChar', value: JSON.stringify(supermarket.OperatingHours) },
            { name: 'latitude', type: 'Float', value: supermarket.Latitude },
            { name: 'longitude', type: 'Float', value: supermarket.Longitude }
          ],
          });
  
  const getMapBySupermarketIdQuery = (supermarketId) => ({
    query: 'SELECT * FROM Supermarket WHERE SupermarketID = @supermarketId',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId }
    ]
  });
  
  const updateMapQuery = (supermarketId, BranchMap) => ({
    query: 'UPDATE Supermarket SET BranchMap = @BranchMap WHERE SupermarketID = @supermarketId',
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'BranchMap', type: 'NVarChar', value: BranchMap }
    ]
  });
  
  const getSupermarketByUserIdQuery = (userId) => ({
    query: `
      SELECT sm.*
      FROM Supermarket sm
      WHERE sm.UserID = @userId
    `,
    params: [
      { name: 'userId', type: 'UniqueIdentifier', value: userId }
    ]
  });
  
  const getSupermarketBybarcodeQuery = (barcode) => ({
    query: `
      SELECT sm.*
      FROM Supermarket sm
      WHERE sm.Barcode = @barcode
    `,
    params: [
      { name: 'barcode', type: 'NVarChar', value: barcode }
    ]
  });
  
  const deleteShoppingListQuery = (listId) => ({
    query: 'DELETE FROM ShoppingList WHERE ListID = @listId',
    params: [
      { name: 'listId', type: 'UniqueIdentifier', value: listId }
    ]
  });
  
  const getShoppingListsByBuyerIdQuery = (buyerId) => ({
    query: 'SELECT * FROM ShoppingList WHERE BuyerID = @buyerId',
    params: [
      { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
    ]
  });
  
  const getShoppingListItemsByListIdQuery = (listId) => ({
    query: 'SELECT * FROM ShoppingListItem WHERE ListID = @listId',
    params: [
      { name: 'listId', type: 'UniqueIdentifier', value: listId }
    ]
  });
  
  const updateShoppingListItemsQuery = (listId, items) => ({
    query: `BEGIN TRANSACTION;
              DELETE FROM ShoppingListItem WHERE ListID = @listId;
  
              INSERT INTO ShoppingListItem (ListItemID, ListID, ItemName, Quantity)
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
  
  const getOrdersByBuyerIdQuery = (buyerId) => ({
    query: 'SELECT * FROM [Order] WHERE UserID = @buyerId',
    params: [
      { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId }
    ]
  });
  
  const getOrderByBuyerIdAndOrderIdQuery = (buyerId, orderId) => ({
    query: `
      SELECT bo.*, sm.BranchName AS SupermarketName
      FROM [Order] bo
      JOIN Supermarket sm ON bo.SupermarketID = sm.SupermarketID
      WHERE bo.UserID = @buyerId AND bo.OrderID = @orderId
    `,
    params: [
      { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId },
      { name: 'orderId', type: 'UniqueIdentifier', value: orderId }
    ]
  });
  
  const getSupermarketsQuery = () => ({
    query: 'SELECT * FROM Supermarket',
    params: []
  });
  
  const createShoppingListQuery = (listName, userId) => ({
    query: `INSERT INTO ShoppingList (ListName, BuyerID) 
            OUTPUT inserted.ListID 
            VALUES (@listName, @userId)`,
    params: [
      { name: 'listName', type: 'NVarChar', value: listName },
      { name: 'userId', type: 'UniqueIdentifier', value: userId },
    ]
  });
  
  const changeShoppingListQuery = (listName, listId) => ({
    query: `UPDATE ShoppingList
            SET ListName = @listName
            WHERE ListID = @listId`,
    params: [
      { name: 'listName', type: 'NVarChar', value: listName },
      { name: 'listId', type: 'UniqueIdentifier', value: listId },
    ]
  });
  
  const addShopInventoryQuery = (inventory) => ({
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
  
  const updateShopInventoryQuery = (inventory) => ({
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
  const createPurchaseQuery = (buyerId, supermarketId, totalAmount, items, sessionId) => ({
    query: `
      BEGIN TRANSACTION;
      
      -- Insert a new order into Order
      DECLARE @OrderID UNIQUEIDENTIFIER = NEWID();
      INSERT INTO Order (OrderID, UserID, SupermarketID, TotalAmount, CreationDate, SessionId, OrderStatus)
      VALUES (@OrderID, @buyerId, @supermarketId, @totalAmount, GETDATE(), @sessionId, Null);
  
      -- Insert each item into OrderItem and update ShopInventory
      ${items.map((item, index) => `
        INSERT INTO OrderItem (OrderItemID, OrderID, ItemID, ItemName, Quantity, Price)
        VALUES (NEWID(), @OrderID, @itemId${index}, @itemName${index}, @quantity${index}, @price${index});
  
        -- Update the inventory for each item
        UPDATE ShopInventory
        SET Quantity = Quantity - @quantity${index}
        WHERE InventoryID = @itemId${index};
      `).join('')}
      
      COMMIT;
      SELECT @OrderID AS OrderID;
    `,
    params: [
      { name: 'buyerId', type: 'UniqueIdentifier', value: buyerId },
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'totalAmount', type: 'Decimal', value: totalAmount },
      { name: 'sessionId', type: 'NVarChar', value: sessionId },
      ...items.flatMap((item, index) => [
        { name: `itemId${index}`, type: 'UniqueIdentifier', value: item.InventoryID },
        { name: `itemName${index}`, type: 'NVarChar', value: item.ItemName },
        { name: `quantity${index}`, type: 'Int', value: item.Quantity },
        { name: `price${index}`, type: 'Decimal', value: item.Price*item.Discount },
      ]),
    ],
  });
  
  
  const deleteShopInventoryQuery = (inventoryId) => ({
    query: `DELETE FROM ShopInventory WHERE InventoryID = @inventoryId`,
    params: [
      { name: 'inventoryId', type: 'UniqueIdentifier', value: inventoryId }
    ]
  });

  const getOrderDetailsByOrderIdQuery = (orderId) => ({
    query: `
      SELECT * FROM SupplierOrderItem WHERE OrderID = @orderId
    `,
    params: [
      { name: 'orderId', type: 'UniqueIdentifier', value: orderId }
    ]
  });

  // const getOrdersBySupplierIdQuery = (userId) => ({
  //   query: `
  //     SELECT * FROM SuperMarketOrder WHERE SupplierID = @userId
  //   `,
  //   params: [
  //     { name: 'userId', type: 'UniqueIdentifier', value: userId }
  //   ]
  // });

  const updateOrderStatusQuery = (orderId, orderStatus) => ({
    query: `
      UPDATE [Order]
      SET OrderStatus = @orderStatus
      WHERE OrderID = @orderId
    `,
    params: [
      { name: 'orderId', type: 'UniqueIdentifier', value: orderId },
      { name: 'orderStatus', type: 'NVarChar', value: orderStatus }
    ]
  });

  const getOrdersBySupermarketIdAndUserTypeSupplierQuery = (supermarketId) => ({
    query: `
      SELECT O.*
      FROM [Order] O
      JOIN [User] U ON O.UserID = U.UserID
      WHERE O.SupermarketID = @supermarketId
        AND U.UserType = 'Supplier';
    `,
    params: [
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId }
    ]
  });

  // const getDetailsForSuperMarketOrderQuery = (orderId) => ({
  //   query: `
  //     SELECT * FROM SuperMarketOrderItem WHERE OrderID = @orderId
  //   `,
  //   params: [
  //     { name: 'orderId', type: 'UniqueIdentifier', value: orderId }
  //   ]
  // });

  const getAllSuppliersQuery = () => ({
    query: `SELECT * FROM [User] WHERE UserType = 'Supplier'`,
    params: []
  });
  
  const getSupplierInventoryBySupplierIdQuery = (supplierId) => ({
    query: `SELECT * FROM SupplierInventory WHERE UserID = @supplierId`,
    params: [
      { name: 'supplierId', type: 'UniqueIdentifier', value: supplierId }
    ]
  }); 

  const createSuperMarketOrderQuery = (supplierId, supermarketId, totalAmount, orderStatus, items) => ({
    query: `
      BEGIN TRANSACTION;
      
      -- Insert a new order into Order
      DECLARE @OrderID UNIQUEIDENTIFIER = NEWID();
      INSERT INTO [Order] (OrderID, UserID, SupermarketID, TotalAmount, CreationDate, SessionId, OrderStatus)
      VALUES (@OrderID, @supplierId, @supermarketId, @totalAmount, GETDATE(), NEWID(), @orderStatus);
  
      -- Insert each item into OrderItem
      ${items.map((item, index) => `
        INSERT INTO OrderItem (OrderItemID, OrderID, ItemID, ItemName, Quantity, Price)
        VALUES (NEWID(), @OrderID, @itemId${index}, @itemName${index}, @quantity${index}, @price${index});
      `).join('')}
      
      COMMIT;
      SELECT @OrderID AS OrderID;
    `,
    params: [
      { name: 'supplierId', type: 'UniqueIdentifier', value: supplierId },
      { name: 'supermarketId', type: 'UniqueIdentifier', value: supermarketId },
      { name: 'totalAmount', type: 'Decimal', value: totalAmount },
      { name: 'orderStatus', type: 'NVarChar', value: orderStatus },
      ...items.flatMap((item, index) => [
        { name: `itemId${index}`, type: 'NVarChar', value: item.ItemID },
        { name: `itemName${index}`, type: 'NVarChar', value: item.ItemName },
        { name: `quantity${index}`, type: 'Int', value: item.Quantity },
        { name: `price${index}`, type: 'Decimal', value: item.Price },
      ]),
    ],
  });
  

  module.exports = {
    // getDetailsForSuperMarketOrderQuery,
    getOrdersBySupermarketIdAndUserTypeSupplierQuery,
    getOrderByBuyerIdAndOrderIdQuery,
    getOrderDetailsByIdQuery,
    createPurchaseQuery,
    getUserByIdQuery,
    getUserByUserNameQuery,
    getShopInventoryQuery,
    getItemBySupermarketIdAndItemNameQuery,
    getItemBySupermarketIdAndBarcodeQuery,
    getMapBySupermarketIdQuery,
    updateMapQuery,
    getSupermarketByUserIdQuery,
    getSupermarketBybarcodeQuery,
    deleteShoppingListQuery,
    getShoppingListsByBuyerIdQuery,
    getShoppingListItemsByListIdQuery,
    updateShoppingListItemsQuery,
    getOrdersByBuyerIdQuery,
    getSupermarketsQuery,
    createShoppingListQuery,
    changeShoppingListQuery,
    addShopInventoryQuery,
    updateShopInventoryQuery,
    deleteShopInventoryQuery,
    updateSupermarketDetailsQuery,
    getOrderDetailsByOrderIdQuery,
    // getOrdersBySupplierIdQuery,
    updateOrderStatusQuery,
    getAllSuppliersQuery,
    getSupplierInventoryBySupplierIdQuery,
    createSuperMarketOrderQuery
  };
  