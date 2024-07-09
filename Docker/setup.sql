CREATE DATABASE MySuperMarketDb;
GO

USE MySuperMarketDb;
GO

CREATE TABLE Users (
    UserID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Email NVARCHAR(100),
    PhoneNumber NVARCHAR(15),
    UserType NVARCHAR(50) -- Buyer or Seller
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
    SellerID UNIQUEIDENTIFIER NULL,
    ItemNumber NVARCHAR(50) NULL,
    Quantity INT NULL,
    Price DECIMAL(18, 2) NULL,
    Discount DECIMAL(18, 2) NULL,
    Location NVARCHAR(255) NULL,
    FOREIGN KEY (SellerID) REFERENCES Sellers(SellerID)
);

-- Insert mock data into Users table
INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, UserType)
VALUES 
('John', 'Doe', 'john.doe@example.com', '1234567890', 'Buyer'),
('Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Seller'),
('Mike', 'Johnson', 'mike.johnson@example.com', '1122334455', 'Buyer'),
('Emily', 'Davis', 'emily.davis@example.com', '5566778899', 'Seller');

-- Insert mock data into Sellers table using the UserID of sellers
INSERT INTO Sellers (SellerID, BranchName, BranchAddress, BranchMap, Location)
VALUES 
((SELECT UserID FROM Users WHERE Email = 'jane.smith@example.com'), 'Main Street Store', '123 Main St', '{ "latitude": "34.0522", "longitude": "-118.2437" }', 'Los Angeles'),
((SELECT UserID FROM Users WHERE Email = 'emily.davis@example.com'), 'Market Plaza', '456 Market St', '{ "latitude": "37.7749", "longitude": "-122.4194" }', 'San Francisco');

-- Insert mock data into ShopInventory
INSERT INTO ShopInventory (SellerID, ItemNumber, Quantity, Price, Discount, Location)
VALUES 
((SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store'), 'A001', 100, 10.99, 0.99, 'Aisle 1'),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store'), 'A002', 200, 5.49, 0.49, 'Aisle 2'),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'), 'B001', 150, 7.99, 0.79, 'Aisle 3'),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'), 'B002', 80, 12.99, 1.29, 'Aisle 4');

-- Insert mock data into ShoppingList
INSERT INTO ShoppingList (BuyerID, Items)
VALUES 
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"id": "A001", "name": "Product A1", "quantity": 2}, {"id": "A002", "name": "Product A2", "quantity": 1}]'),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"id": "B001", "name": "Product B1", "quantity": 3}, {"id": "B002", "name": "Product B2", "quantity": 1}]');

-- Insert mock data into BuyerOrders
INSERT INTO BuyerOrders (BuyerID, Items, TotalAmount, SellerID)
VALUES 
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"id": "A001", "name": "Product A1", "quantity": 2, "price": 10.99}, {"id": "A002", "name": "Product A2", "quantity": 1, "price": 5.49}]', 27.47, (SELECT UserID FROM Users WHERE Email = 'jane.smith@example.com')),
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"id": "A001", "name": "Product A1", "quantity": 1, "price": 10.99}, {"id": "A002", "name": "Product A2", "quantity": 2, "price": 5.49}]', 21.97, (SELECT UserID FROM Users WHERE Email = 'jane.smith@example.com')),
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"id": "A001", "name": "Product A1", "quantity": 3, "price": 10.99}, {"id": "A002", "name": "Product A2", "quantity": 1, "price": 5.49}]', 38.47, (SELECT UserID FROM Users WHERE Email = 'jane.smith@example.com')),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"id": "B001", "name": "Product B1", "quantity": 3, "price": 7.99}, {"id": "B002", "name": "Product B2", "quantity": 1, "price": 12.99}]', 36.96, (SELECT UserID FROM Users WHERE Email = 'emily.davis@example.com')),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"id": "B001", "name": "Product B1", "quantity": 2, "price": 7.99}, {"id": "B002", "name": "Product B2", "quantity": 2, "price": 12.99}]', 40.96, (SELECT UserID FROM Users WHERE Email = 'emily.davis@example.com')),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"id": "B001", "name": "Product B1", "quantity": 1, "price": 7.99}, {"id": "B002", "name": "Product B2", "quantity": 3, "price": 12.99}]', 46.96, (SELECT UserID FROM Users WHERE Email = 'emily.davis@example.com'));
