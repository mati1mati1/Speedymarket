CREATE DATABASE MySuperMarketDb;
GO



USE MySuperMarketDb;
GO

-- Create User Table
CREATE TABLE [User] (
    UserID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserName NVARCHAR(100) UNIQUE NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(15),
    UserType NVARCHAR(50) NOT NULL -- Buyer or Seller
);

-- Create Supermarket Table
CREATE TABLE Supermarket (
    SupermarketID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    BranchName NVARCHAR(100) NOT NULL,
    BranchAddress NVARCHAR(255) NOT NULL,
    BranchMap NVARCHAR(MAX) NOT NULL,
    Location NVARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- Create BuyerOrder Table
CREATE TABLE BuyerOrder (
    OrderID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BuyerID UNIQUEIDENTIFIER NOT NULL,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    CreationDate DATETIME DEFAULT GETDATE() NOT NULL,
    SupermarketID UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (BuyerID) REFERENCES [User](UserID),
    FOREIGN KEY (SupermarketID) REFERENCES Supermarket(SupermarketID)
);

-- Create BuyerOrderItem Table to store individual items in orders
CREATE TABLE BuyerOrderItem (
    OrderItemID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderID UNIQUEIDENTIFIER NOT NULL,
    ItemID NVARCHAR(50) NOT NULL,
    ItemName NVARCHAR(255) NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES BuyerOrder(OrderID)
);

-- Create ShoppingList Table
CREATE TABLE ShoppingList (
    ListID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ListName NVARCHAR(100) NOT NULL,
    BuyerID UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (BuyerID) REFERENCES [User](UserID)
);

-- Create ShoppingListItem Table to store individual items in shopping lists
CREATE TABLE ShoppingListItem (
    ListItemID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ListID UNIQUEIDENTIFIER NOT NULL,
    ItemID NVARCHAR(50) NOT NULL,
    ItemName NVARCHAR(255) NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (ListID) REFERENCES ShoppingList(ListID)
);

-- Create ShopInventory Table
CREATE TABLE ShopInventory (
    InventoryID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SupermarketID UNIQUEIDENTIFIER NOT NULL,
    ItemNumber NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    Discount DECIMAL(18, 2) NOT NULL,
    Location INT NOT NULL,
    Barcode NVARCHAR(100),
    FOREIGN KEY (SupermarketID) REFERENCES Supermarket(SupermarketID)
);

-- Insert mock data into User table
INSERT INTO [User] (UserName, FirstName, LastName, Email, PhoneNumber, UserType)
VALUES 
('john.doe', 'John', 'Doe', 'john.doe@example.com', '1234567890', 'Buyer'),
('jane.smith', 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Seller'),
('mike.johnson', 'Mike', 'Johnson', 'mike.johnson@example.com', '1122334455', 'Buyer'),
('emily.davis', 'Emily', 'Davis', 'emily.davis@example.com', '5566778899', 'Seller');

-- Insert mock data into Supermarket table using the UserID of sellers
INSERT INTO Supermarket (UserID, BranchName, BranchAddress, BranchMap, Location)
VALUES 
((SELECT UserID FROM [User] WHERE Email = 'jane.smith@example.com'), 'Main Street Store', '123 Main St', '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"name":"מדף","left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"name":"מדף","left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"name":"מדף","left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"name":"מדף","left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"name":"מדף","left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"name":"מדף","left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"name":"מדף","left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"name":"מדף","left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"name":"מדף","left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"name":"מדף","left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"name":"מדף","left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"name":"מדף","left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"name":"מדף","left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"name":"מדף","left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 'Los Angeles'),
((SELECT UserID FROM [User] WHERE Email = 'emily.davis@example.com'), 'Market Plaza', '456 Market St', '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 'San Francisco');

-- Insert mock data into ShopInventory
INSERT INTO ShopInventory (SupermarketID, ItemNumber, Quantity, Price, Discount, Location, Barcode)
VALUES 
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-001', 100, 10.99, 0.99, 1, 'barcode-001'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-002', 200, 5.49, 0.49, 2, 'barcode-002'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-003', 150, 7.99, 0.79, 3, 'barcode-003'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-004', 80, 12.99, 1.29, 4, 'barcode-004'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-005', 50, 15.99, 2.49, 5, 'barcode-005'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-006', 90, 6.99, 0.69, 6, 'barcode-006'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-007', 120, 8.49, 0.89, 7, 'barcode-007'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-008', 110, 9.99, 1.09, 8, 'barcode-008'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-009', 140, 4.99, 0.49, 9, 'barcode-009'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'item-010', 130, 3.99, 0.39, 10, 'barcode-010'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-001', 100, 10.99, 0.99, 1, 'barcode-011'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-002', 200, 5.49, 0.49, 2, 'barcode-012'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-003', 150, 7.99, 0.79, 3, 'barcode-013'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-004', 80, 12.99, 1.29, 4, 'barcode-014'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-005', 50, 15.99, 2.49, 5, 'barcode-015'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-006', 90, 6.99, 0.69, 6, 'barcode-016'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-007', 120, 8.49, 0.89, 7, 'barcode-017'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-008', 110, 9.99, 1.09, 8, 'barcode-018'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-009', 140, 4.99, 0.49, 9, 'barcode-019'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'item-010', 130, 3.99, 0.39, 10, 'barcode-020');

-- Insert mock data into ShoppingList and ShoppingListItem
INSERT INTO ShoppingList (ListID, ListName, BuyerID)
VALUES 
(DEFAULT, 'List1', (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')),
(DEFAULT, 'List2', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')),
(DEFAULT, 'List3', (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')),
(DEFAULT, 'List4', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')),
(DEFAULT, 'List5', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')),
(DEFAULT, 'List6', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'));

-- Insert mock data into ShoppingListItem
INSERT INTO ShoppingListItem (ListID, ItemID, ItemName, Quantity)
VALUES 
((SELECT ListID FROM ShoppingList WHERE ListName = 'List1'), 'item-001', 'Product A1', 2),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List1'), 'item-002', 'Product A2', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List2'), 'item-006', 'Product B1', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List2'), 'item-007', 'Product B2', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List3'), 'item-001', 'Product A1', 2),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List3'), 'item-002', 'Product A2', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List4'), 'item-006', 'Product B1', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List4'), 'item-007', 'Product B2', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List5'), 'item-006', 'Product B1', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List5'), 'item-007', 'Product B2', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List6'), 'item-006', 'Product B1', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List6'), 'item-007', 'Product B2', 1);

-- Insert mock data into BuyerOrder and BuyerOrderItem
INSERT INTO BuyerOrder (BuyerID, TotalAmount, SupermarketID)
VALUES 
((SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com'), 27.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com'), 21.97, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com'), 38.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'), 36.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza')),
((SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'), 40.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza')),
((SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'), 46.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'));

INSERT INTO BuyerOrderItem (OrderID, ItemID, ItemName, Quantity, Price)
VALUES 
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 27.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-001', 'Product A1', 2, 10.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 27.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-002', 'Product A2', 1, 5.49),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 21.97 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-001', 'Product A1', 1, 10.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 21.97 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-002', 'Product A2', 2, 5.49),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 38.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-001', 'Product A1', 3, 10.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 38.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-002', 'Product A2', 1, 5.49),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 36.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-006', 'Product B1', 3, 7.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 36.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-007', 'Product B2', 1, 12.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 40.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-006', 'Product B1', 2, 7.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 40.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-007', 'Product B2', 2, 12.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 46.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-006', 'Product B1', 1, 7.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 46.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-007', 'Product B2', 3, 12.99);
