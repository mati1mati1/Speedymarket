export interface User {
    UserID: string;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    UserType: string; // Buyer or Seller
  }
  
  export interface BuyerOrder {
    OrderID: string;
    BuyerID: string;
    Items: string; // JSON data
    TotalAmount: number;
    CreationDate: string;
    SellerID: string;
  }
  
  export interface ShoppingList {
    ListID: string;
    BuyerID: string;
    Items: string; // JSON data
  }
  
  export interface FullTable {
    SellerID: string;
    ItemNumber: string;
    Quantity: number;
    Price: number;
    Discount: number;
    Location: string;
  }
  
  export interface Seller {
    SellerID: string;
    BranchName: string;
    BranchAddress: string;
    BranchMap: string;
    Location: string;
  }
  