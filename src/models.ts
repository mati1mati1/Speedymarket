export interface User {
    UserID: string;
    UserName: string;
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
    ListName: string;
    BuyerID: string;
    Items: string;
  }
  
  export interface ShopInventory {
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
  