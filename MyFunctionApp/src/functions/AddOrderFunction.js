const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
    const account = process.env.STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.STORAGE_ACCOUNT_KEY;
    const tableName = "UsersOrder";

    const credential = new AzureNamedKeyCredential(account, accountKey);
    const tableClient = new TableClient(
        `http://127.0.0.1:10002/${account}`,
        tableName,
        credential
    );

    const { orderId, buyerId, items, totalAmount, sellerId } = req.body;
    if (!orderId || !buyerId || !items || !totalAmount || !sellerId) {
        context.res = {
            status: 400,
            body: "Please provide orderId, buyerId, items, totalAmount, and sellerId"
        };
        return;
    }

    const creationDate = new Date().toISOString();
    const order = {
        partitionKey: "orderPartition",
        rowKey: orderId,
        buyerId: buyerId,
        items: JSON.stringify(items),
        totalAmount: totalAmount,
        creationDate: creationDate,
        sellerId: sellerId
    };

    try {
        await tableClient.createEntity(order);
        context.res = {
            status: 200,
            body: "Order created successfully"
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error creating order: ${error.message}`
        };
    }
};
