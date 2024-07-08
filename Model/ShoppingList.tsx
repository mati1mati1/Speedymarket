export class ShoppingList {
    partitionKey: string;
    rowKey: string;
    buyerId: string;
    items: string;

    constructor(listId: string, buyerId: string, items: object) {
        this.partitionKey = "shoppingListPartition";
        this.rowKey = listId;
        this.buyerId = buyerId;
        this.items = JSON.stringify(items);
    }
}