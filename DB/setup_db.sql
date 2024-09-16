CREATE DATABASE MySuperMarketDb;
GO

USE MySuperMarketDb;
GO

CREATE TABLE Users (
    UserID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserName NVARCHAR(100) UNIQUE,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Email NVARCHAR(100) ,
    PhoneNumber NVARCHAR(15),
    UserType NVARCHAR(50) -- Buyer or Seller or Supplier
);

CREATE TABLE BuyerOrders (
    OrderID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BuyerID UNIQUEIDENTIFIER,
    Items NVARCHAR(MAX), -- JSON data
    TotalAmount DECIMAL(18, 2),
    CreationDate DATETIME DEFAULT GETDATE(),
    SellerID UNIQUEIDENTIFIER,
    FOREIGN KEY (BuyerID) REFERENCES Users(UserID),
    FOREIGN KEY (SellerID) REFERENCES Users(UserID)
);

CREATE TABLE ShoppingList (
    ListID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BuyerID UNIQUEIDENTIFIER,
    Items NVARCHAR(MAX), -- JSON data
    FOREIGN KEY (BuyerID) REFERENCES Users(UserID)
);

CREATE TABLE Sellers (
    SellerID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BranchName NVARCHAR(100),
    BranchAddress NVARCHAR(255),
    BranchMap NVARCHAR(MAX),
    Location NVARCHAR(255)
);

CREATE TABLE ShopInventory (
    SellerID   UNIQUEIDENTIFIER NULL,
    ItemName NVARCHAR (50)    NULL,
    Quantity   INT              NULL,
    Price      DECIMAL (18, 2)  NULL,
    Discount   DECIMAL (18, 2)  NULL,
    Location   NVARCHAR (255)   NULL,
    FOREIGN KEY (SellerID) REFERENCES Sellers(SellerID)
);


