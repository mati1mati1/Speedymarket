const sql = require('mssql');
const jwt = require('jsonwebtoken');
const queries = require('./queries'); 
const axios = require('axios');

const getQueryByName = async (functionName, params) => {
    console.log("this is the params in the index of the function: " + JSON.stringify(params));
    switch (functionName) {
        case 'getUserById':
            return queries.getUserByIdQuery(params.userId);
        case 'getUserByUserName':
            return queries.getUserByUserNameQuery(params.userName);
        case 'getItemBySupermarketIdAndItemName':
            return queries.getItemBySupermarketIdAndItemNameQuery(params.supermarketId, params.ItemName);
        case 'getItemBySupermarketIdAndBarcode':
            return queries.getItemBySupermarketIdAndBarcodeQuery(params.supermarketId, params.barcode);
        case 'getMapBySupermarketId':
            return queries.getMapBySupermarketIdQuery(params.supermarketId);
        case 'updateMap':
            return queries.updateMapQuery(params.supermarketId, params.BranchMap);
        case 'getSupermarketByUserId':
            return queries.getSupermarketByUserIdQuery(params.userId);
        case 'getSupermarketBySupermarketId':
            return queries.getSupermarketByIdQuery(params.supermarketId);
        case 'getSupermarketByBarcode':
            return queries.getSupermarketBybarcodeQuery(params.barcode);
        case 'deleteShoppingList':
            return queries.deleteShoppingListQuery(params.listId);
        case 'getShoppingListsByBuyerId':
            return queries.getShoppingListsByBuyerIdQuery(params.userId);
        case 'getShoppingListItemsByListId':
            return queries.getShoppingListItemsByListIdQuery(params.listId);
        case 'getShopInventory':
            return queries.getShopInventoryQuery(params.userId);
        case 'updateShoppingListItems':
            return queries.updateShoppingListItemsQuery(params.listId, params.items);
        case 'getOrdersByBuyerId':
            return queries.getOrdersByBuyerIdQuery(params.userId);
        case 'getSupermarkets':
            return queries.getSupermarketsQuery();
        case 'createShoppingList':
            return queries.createShoppingListQuery(params.listName, params.userId);
        case 'changeShoppingListName':
            return queries.changeShoppingListQuery(params.listName, params.listId);
        case 'addShopInventory':
            return queries.addShopInventoryQuery(params.shopInventory);
        case 'updateShopInventory':
            return queries.updateShopInventoryQuery(params.shopInventory);
        case 'deleteShopInventory':
            return queries.deleteShopInventoryQuery(params.inventoryId);
        case 'updateSupermarketDetailsQuery':
            const address = `${params.Street?.name}, ${params.City?.name}, ${params.Country?.name}`;
            const coordinates = await getCoordinatesFromAzureMaps(address);
            params.Latitude = coordinates.latitude;
            params.Longitude = coordinates.longitude;
            return queries.updateSupermarketDetailsQuery(params);
        case 'createPurchaseQuery':
            return queries.createPurchaseQuery(params.buyerId, params.supermarketId, params.totalAmount, params.items, params.sessionId);
        case 'getOrderDetailsById':
            return queries.getOrderDetailsByIdQuery(params.orderId);
        case 'getOrderByBuyerIdAndOrderId':
            return queries.getOrderByBuyerIdAndOrderIdQuery(params.buyerId,params.orderId);
        case 'getOrderDetailsByOrderId':
            return queries.getOrderDetailsByOrderIdQuery(params.orderId);
        case 'getOrdersBySupplierId':
            return queries.getOrdersByBuyerIdQuery(params.userId);
        case 'getOrdersBySuperMarketIdQuery':
            return queries.getOrdersByBuyerIdQuery(params.supermarketId);
        // case 'getDetailsForSuperMarketOrderQuery':
        //     return queries.getDetailsForSuperMarketOrderQuery(params.orderId);
        case 'updateOrderStatus':
            return queries.updateOrderStatusQuery(params.orderId);
        case 'getAllSuppliers':
            return queries.getAllSuppliersQuery();
        case 'getSupplierInventory':
            return queries.getSupplierInventoryBySupplierIdQuery(params.supplierId);
        default:
            throw new Error('Invalid function name');
    }
};

async function getCoordinatesFromAzureMaps(address) {
    const response = await axios.get(`https://atlas.microsoft.com/search/address/json`, {
      params: {
        'api-version': '1.0',
        'subscription-key': 'BO42TKpTwoUXPHMelZ8m922mkYOAUGKOPknUSMbdJiczaocLoB8GJQQJ99AHAC5RqLJPSPD9AAAgAZMPBGJy',
        'query': address,
        'limit': '1',
      },
    });
    console.log(response.data);
    if (response.data.results.length > 0) {
      const location = response.data.results[0].position;
      console.log(location);
      return {
        latitude: location.lat,
        longitude: location.lon,
      };
    } else {
      throw new Error('No results found');
    }
  }

module.exports = async function (context, req) {
    const token = req.headers.authorization?.split(' ')[1];
    const functionName = req.body.functionName;
    const params = req.body.params;
    console.log("params: " + JSON.stringify(params));
    console.log("0000000000000000000000000000000000000000000000000000")
    if (!token) {
        context.res = {
            status: 401,
            body: "Authorization token is required"
        };
        return;
    }

    if (!functionName || !params) {
        console.log("fuck fuck fuck")
        context.res = {
            status: 400,
            body: "Please pass a function name and its parameters in the request body"
        };
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const config = {
            user: 'SA',
            password: 'Aa123456',
            server: 'localhost',
            port: 1433,
            database: 'MySuperMarketDb',
            options: {
                encrypt: false 
            }
        };

        await sql.connect(config);
        const request = new sql.Request();
        console.log("userID" + decoded.userId);
        const queryObject = await getQueryByName(functionName, params);
        console.log(queryObject.query);
        for (const param of queryObject.params) {
            if(param.name === 'userId' || param.name === 'buyerId' || param.name === 'sellerId'){
                request.input(param.name, sql[param.type], decoded.userId);
            }
            else if(param.name === 'userName'){
                request.input(param.name, sql[param.type], decoded.userName);
            }
            else{
                request.input(param.name, sql[param.type], param.value);
            }
        }
        context.log('SQL Query:', queryObject.query);
        context.log('SQL Query Parameters:', queryObject.params);
        const result = await request.query(queryObject.query);

        context.log('SQL Query Result:', result.recordset);

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            context.log('JWT Error:', err);

            context.res = {
                status: 401,
                body: `JWT Error: ${err.message}`
            };
        } else {
            context.log('Error executing SQL query:', err);

            context.res = {
                status: 500,
                body: `Error: ${err.message}`
            };
        }
    } finally {
        sql.close();
    }
};
