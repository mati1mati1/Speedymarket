import { User } from '../models';
import {getUserByUserName,getShoppingListsByBuyerId,getOrdersByBuyerId,getSellerById } from './api';
interface LoginResponse {
    success: boolean;
    user: {
      role: 'customer' | 'manager';
      username: string;
    };
  }
  
  // פונקציה פשוטה לאימות משתמש
  export async function login(username: string, password: string): Promise<LoginResponse> {
    debugger;
    const user = await getUserByUserName(username);
    debugger
    if (user) {
      const role = user.UserType === 'Seller' ? 'manager' : 'customer';
      sessionStorage.setItem('user', JSON.stringify(user));
      if (role === 'manager') {
        const seller = await getSellerById(user.UserID);
        console.log(seller);
        sessionStorage.setItem('seller', JSON.stringify(seller));
      }
      else if (role === 'customer') {
        const ShoppingList = await getShoppingListsByBuyerId(user.UserID);
        console.log(ShoppingList);
        sessionStorage.setItem('ShoppingLists', JSON.stringify(ShoppingList));
        const BuyerOrder = await getOrdersByBuyerId(user.UserID);
        console.log(BuyerOrder);
        sessionStorage.setItem('BuyerOrder', JSON.stringify(BuyerOrder)); 
      }

      return {
        success: true,
        user: {
          role,
          username: user.UserName,
        },
      };
    } else {
      return {
        success: false,
        user: { role: 'customer', username: '' }, // Return empty user on failure
      };
    }
  }
  
  // דוגמה לפונקציה המבוססת על fetch (כרגע בתגובה להערות)
  // export async function login(username: string, password: string): Promise<LoginResponse> {
  //   const response = await fetch('https://example.com/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username, password }),
  //   });
  //   return response.json();
  // }
  