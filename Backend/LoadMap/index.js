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
    const query = "SELECT * FROM BranchMap";
    try {
        const result = await branchMap.request.query(query);
        context.res = {
            status: 200,
            body: result
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error executing SQL query: " + error.message
        };
    }
};
