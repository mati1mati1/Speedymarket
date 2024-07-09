import axios from 'axios';

// Define the base URL for the API

import {
  getUserById,
  getItemBySellerIdAndItemNumber,
  getSellerById,
  getShoppingListByBuyerId,
  addOrUpdateShoppingListByBuyerId,
  getOrdersByBuyerId
} from '../api/api';  // Adjust the import path accordingly

describe('API call integration tests', () => {

  it('should fetch user by ID', async () => {
    const userId = "fc34dc92-f3ec-419b-91b8-10d409432cca"; // Replace with an actual user ID from your database
    const result = await getUserById(userId);
    console.log(result); // For debugging purposes
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].UserID).toBe(userId);
  });

//   it('should fetch item by seller ID and item number', async () => {
//     const sellerId = 'fc34dc92-f3ec-419b-91b8-10d409432cca'; // Replace with an actual seller ID
//     const itemNumber = 'A001'; // Replace with an actual item number
//     const result = await getItemBySellerIdAndItemNumber(sellerId, itemNumber);
//     console.log(result); // For debugging purposes
//     expect(result).toBeInstanceOf(Array);
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0].SellerID).toBe(sellerId);
//   });

//   it('should fetch seller by ID', async () => {
//     const sellerId = 'fc34dc92-f3ec-419b-91b8-10d409432cca'; // Replace with an actual seller ID
//     const result = await getSellerById(sellerId);
//     console.log(result); // For debugging purposes
//     expect(result).toBeInstanceOf(Array);
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0].SellerID).toBe(sellerId);
//   });

//   it('should fetch shopping list by buyer ID', async () => {
//     const buyerId = '0da18603-1ff0-408d-9936-63cb47105532'; // Replace with an actual buyer ID
//     const result = await getShoppingListByBuyerId(buyerId);
//     console.log(result); // For debugging purposes
//     expect(result).toBeInstanceOf(Array);
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0].BuyerID).toBe(buyerId);
//   });

//   it('should add or update shopping list by buyer ID', async () => {
//     const listId = '14bb4275-b96f-48ee-bec1-73304cae5c3f'; // Replace with an actual list ID or use a new one
//     const buyerId = '0da18603-1ff0-408d-9936-63cb47105532'; // Replace with an actual buyer ID
//     const items = '[{"id": "A003", "name": "Product A3", "quantity": 2}]'; // Replace with actual items
//     await addOrUpdateShoppingListByBuyerId(listId, buyerId, items);
//     // No return value to check, so no assertions here
//   });

//   it('should fetch orders by buyer ID', async () => {
//     const buyerId = '0da18603-1ff0-408d-9936-63cb47105532'; // Replace with an actual buyer ID
//     const result = await getOrdersByBuyerId(buyerId);
//     console.log(result); // For debugging purposes
//     expect(result).toBeInstanceOf(Array);
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0].BuyerID).toBe(buyerId);
//   });
});
