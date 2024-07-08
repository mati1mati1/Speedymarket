const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
    const account = process.env.STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.STORAGE_ACCOUNT_KEY;

    const tableName = req.query.tableName || (req.body && req.body.tableName);
    const partitionKey = req.query.partitionKey || (req.body && req.body.partitionKey);
    const rowKey = req.query.rowKey || (req.body && req.body.rowKey);

    if (!tableName || !partitionKey || !rowKey) {
        context.res = {
            status: 400,
            body: "Please provide tableName, partitionKey, and rowKey"
        };
        return;
    }

    const credential = new AzureNamedKeyCredential(account, accountKey);
    const tableClient = new TableClient(
        `http://127.0.0.1:10002/${account}`,
        tableName,
        credential
    );

    const entity = req.body;
    entity.partitionKey = partitionKey;
    entity.rowKey = rowKey;

    try {
        await tableClient.createEntity(entity);
        context.res = {
            status: 200,
            body: "Entity created successfully"
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error creating entity: ${error.message}`
        };
    }
};
// Use this function to add entities to any specified Azure Table Storage table by providing the table name, partition key, and row key.
// Include the entity data in the request body, including the partition key and row key, to insert the entity into the specified table.
// curl -X POST "http://localhost:7071/api/AddEntityFunction" \
//     -H "Content-Type: application/json" \
//     -d '{
//         "tableName": "UsersOrder",
//         "partitionKey": "orderPartition",
//         "rowKey": "order123",
//         "buyerId": "user123",
//         "items": [{"itemName": "item1", "quantity": 2}, {"itemName": "item2", "quantity": 1}],
//         "totalAmount": 100,
//         "creationDate": "2024-07-08T12:34:56Z",
//         "sellerId": "seller123"
//     }'