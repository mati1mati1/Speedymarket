const sql = require('mssql');
const jwt = require('jsonwebtoken');

module.exports = async function (context, req) {
    const token = req.headers.authorization?.split(' ')[1];
    const query = req.body.query;
    const params = req.body.params;

    if (!token) {
        context.res = {
            status: 401,
            body: "Authorization token is required"
        };
        return;
    }

    if (!query || !params) {
        context.res = {
            status: 400,
            body: "Please pass a SQL query and its parameters in the request body"
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

        for (const param of params) {
            request.input(param.name, sql[param.type], param.value);
        }

        const result = await request.query(query);

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
