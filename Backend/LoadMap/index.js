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
            body: "Please pass supermarketId and mapData in the request body"
        };
        return;
    }

    try {
        await sql.connect(config);
        const mapQuery = `SELECT * FROM Sellers WHERE SellerID = @supermarketId`;
        const mapRequest = new sql.Request();
        mapRequest.input('supermarketId', sql.UniqueIdentifier, supermarketId);
        const mapResult = await mapRequest.query(mapQuery);
        //context.log('Map data fetched:', mapResult.recordset);
        if (mapResult.recordset.length === 0) throw new Error('No map data found for given supermarketId');
        branchMap = JSON.parse(mapResult.recordset[0].BranchMap);

        branchMap = await request.query(query);
        branchMap = JSON.parse(mapResult.recordset[0].BranchMap);

        context.res = {
            status: 200,
            body: { map: branchMap }
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    } finally {
        sql.close();
    }
};
