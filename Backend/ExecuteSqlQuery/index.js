const sql = require('mssql');

module.exports = async function (context, req) {
    const query = req.body.query;
    const params = req.body.params;

    if (!query || !params) {
        context.res = {
            status: 400,
            body: "Please pass a SQL query and its parameters in the request body"
        };
        return;
    }

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

    try {
        // Connect to the database
        await sql.connect(config);
        const request = new sql.Request();

        // Add parameters to the request
        for (const param of params) {
            request.input(param.name, sql[param.type], param.value);
        }

        const result = await request.query(query);
        
        // Log the result data
        context.log('SQL Query Result:', result.recordset);

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        // Log the error
        context.log('Error executing SQL query:', err);

        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    } finally {
        // Close the database connection
        sql.close();
    }
};
