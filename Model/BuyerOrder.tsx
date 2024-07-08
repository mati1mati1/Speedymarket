export class BuyerOrder {
    partitionKey: string;
    rowKey: string;
    buyerId: string;
    items: string;
    totalAmount: number;
    creationDate: string;
    sellerId: string;

    constructor(orderId: string, buyerId: string, items: object, totalAmount: number, creationDate: string, sellerId: string) {
        this.partitionKey = "orderPartition";
        this.rowKey = orderId;
        this.buyerId = buyerId;
        this.items = JSON.stringify(items);
        this.totalAmount = totalAmount;
        this.creationDate = creationDate;
        this.sellerId = sellerId;
    }
}
