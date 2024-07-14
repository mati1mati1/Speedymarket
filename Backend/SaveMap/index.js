const sql = require('mssql');

const config = {
    user: 'SA',
    password: 'Aa123456',
    server: 'localhost',
    port: 1433,
    database: 'MySuperMarketDb',
    options: {
        encrypt: false // Disable SSL for local development
    }
};

module.exports = async function (context, req) {
    const { supermarketId } = req.body;

    if (!supermarketId) {
        context.res = {
            status: 400,
            body: "Please pass supermarketId in the request body"
        };
        return;
    }

    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('supermarketId', sql.UniqueIdentifier, supermarketId);

        const query = `
            SELECT BranchMap
            FROM Sellers
            WHERE SellerID = @supermarketId
        `;

        const result = await request.query(query);

        if (result.recordset.length > 0) {
            context.res = {
                status: 200,
                body: JSON.parse(result.recordset[0].BranchMap)
            };
        } else {
            context.res = {
                status: 404,
                body: "Map not found"
            };
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    } finally {
        sql.close();
    }
};
