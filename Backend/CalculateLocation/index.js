const sql = require('mssql');

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
module.exports = async function (context, req) {
    const { supermarketId, barcode } = req.body;

    if (!supermarketId || !barcode) {
        context.res = {
            status: 400,
            body: "Please pass a supermarketId and barcode in the request body"
        };
        return;
    }

    try {
        // Connect to the database
        await sql.connect(config);

        // Fetch the item from ShopInventory
        const result = await sql.query`SELECT * FROM ShopInventory WHERE SupermarketID = ${supermarketId} AND Barcode = ${barcode}`;
        const item = result.recordset[0];

        if (item) {
            context.res = {
                status: 200,
                body: item
            };
        } else {
            context.res = {
                status: 404,
                body: "Item not found"
            };
        }
    } catch (error) {
        context.log('Error:', error);
        context.res = {
            status: 500,
            body: `Error: ${error.message}`
        };
    } finally {
        // Close the database connection
        sql.close();
    }
};
