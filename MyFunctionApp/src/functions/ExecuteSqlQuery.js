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

    try {
        await sql.connect(process.env.DB_CONNECTION_STRING);
        const request = new sql.Request();

        // Add parameters to the request
        for (const param of params) {
            request.input(param.name, param.type, param.value);
        }

        const result = await request.query(query);
        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    }
};
