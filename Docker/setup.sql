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
    UserType NVARCHAR(50) NOT NULL -- Buyer or Seller or Supplier
);
GO

-- Create Supermarket Table
CREATE TABLE Supermarket (
    SupermarketID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER UNIQUE NOT NULL,
    BranchName NVARCHAR(100) NOT NULL,
    Barcode NVARCHAR(100),
    OperatingHours NVARCHAR(MAX),
    Country NVARCHAR(100),
    City NVARCHAR(100),
    Street NVARCHAR(100),
    StreetNumber NVARCHAR(10),
    BranchMap NVARCHAR(MAX) NOT NULL,
    WiFiPassword NVARCHAR(255) NOT NULL,
    WiFiSSID NVARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);
GO

-- Create BuyerOrder Table
CREATE TABLE BuyerOrder (
    OrderID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BuyerID UNIQUEIDENTIFIER NOT NULL,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    CreationDate DATETIME DEFAULT GETDATE() NOT NULL,
    SupermarketID UNIQUEIDENTIFIER NOT NULL,
    SessionId NVARCHAR(250) UNIQUE,
    FOREIGN KEY (BuyerID) REFERENCES [User](UserID),
    FOREIGN KEY (SupermarketID) REFERENCES Supermarket(SupermarketID)
);
GO

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
GO

-- Create ShoppingList Table
CREATE TABLE ShoppingList (
    ListID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ListName NVARCHAR(100) NOT NULL,
    BuyerID UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (BuyerID) REFERENCES [User](UserID)
);
GO

-- Create ShoppingListItem Table to store individual items in shopping lists
CREATE TABLE ShoppingListItem (
    ListItemID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ListID UNIQUEIDENTIFIER NOT NULL,
    ItemName NVARCHAR(255) NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (ListID) REFERENCES ShoppingList(ListID)
);
GO

-- Create ShopInventory Table
CREATE TABLE ShopInventory (
    InventoryID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SupermarketID UNIQUEIDENTIFIER NOT NULL,
    ItemName NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(18, 2) NOT NULL,
    Discount DECIMAL(18, 2) NOT NULL,
    Location INT NOT NULL,
    Barcode NVARCHAR(100),
    FOREIGN KEY (SupermarketID) REFERENCES Supermarket(SupermarketID)
);
GO

-- Create ESP32Position Table
CREATE TABLE ESP32Position (
    ESP32ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SupermarketID UNIQUEIDENTIFIER NOT NULL,
    DeviceName NVARCHAR(100) NOT NULL,
    XCoordinate INT NOT NULL,
    YCoordinate INT NOT NULL,
    FOREIGN KEY (SupermarketID) REFERENCES Supermarket(SupermarketID)
);
GO

-- Create Supplier Table
CREATE TABLE Supplier (
    SupplierID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER UNIQUE NOT NULL,
    SupplierName NVARCHAR(100) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- Create table for the Suppliers Orders (contains the order id, total amount, date, status, supplier id and supermarket id)
CREATE TABLE SupplierOrder (
    OrderID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    CreationDate DATETIME DEFAULT GETDATE() NOT NULL,
    SupermarketID UNIQUEIDENTIFIER NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (SupermarketID) REFERENCES Supermarket(SupermarketID)
);

-- Create table for the Supplier Order Items (contains the order id, item id, item name, quantity, price)
CREATE TABLE SupplierOrderItem (
    OrderItemID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderID UNIQUEIDENTIFIER NOT NULL,
    ItemID NVARCHAR(50) NOT NULL,
    ItemName NVARCHAR(255) NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES SupplierOrder(OrderID)
);

-- Insert mock data into User table
INSERT INTO [User] (UserName, FirstName, LastName, Email, PhoneNumber, UserType)
VALUES 
('john.doe', 'John', 'Doe', 'john.doe@example.com', '1234567890', 'Buyer'),
('jane.smith', 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Seller'),
('mike.johnson', 'Mike', 'Johnson', 'mike.johnson@example.com', '1122334455', 'Buyer'),
('tal.sabel', 'Tal', 'Sabel', 'talsabel@example.com', '5566778899', 'Supplier'),
('emily.davis', 'Emily', 'Davis', 'emily.davis@example.com', '5566778899', 'Seller');
GO

-- Insert mock data into Supermarket table using the UserID of sellers
INSERT INTO Supermarket 
    (UserID, BranchName, BranchMap, WiFiPassword, WiFiSSID, Country, City, Street, StreetNumber, Latitude, Longitude)
VALUES 
(
    (SELECT UserID FROM [User] WHERE Email = 'jane.smith@example.com'), 
    'Main Street Store', 
    '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"name":"מדף","left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"name":"מדף","left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"name":"מדף","left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"name":"מדף","left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"name":"מדף","left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"name":"מדף","left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"name":"מדף","left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"name":"מדף","left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"name":"מדף","left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"name":"מדף","left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"name":"מדף","left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"name":"מדף","left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"name":"מדף","left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"name":"מדף","left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 
    'supermarket_password', 
    'supermarket_ssid', 
    '{"id":106,"iso2":"IL","name":"Israel"', 
    '{"name":"Tel Aviv","id":57564}',
    '{"id":154741757,"name":"נצח ישראל"}', 
    '11', 
    32.07773, 
     34.77969
),
(
    (SELECT UserID FROM [User] WHERE Email = 'emily.davis@example.com'), 
    'Market Plaza', 
    '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"name":"מדף","left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"name":"מדף","left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"name":"מדף","left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"name":"מדף","left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"name":"מדף","left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"name":"מדף","left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"name":"מדף","left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"name":"מדף","left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"name":"מדף","left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"name":"מדף","left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"name":"מדף","left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"name":"מדף","left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"name":"מדף","left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"name":"מדף","left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 
    'market_password', 
    'supermarket_ssid', 
    '{"id":106,"iso2":"IL","name":"Israel"', 
    '{"name":"Tel Aviv","id":57564}',
    '{"id":154741757,"name":"שדרות רוטשילד"}', 
    '10', 
    32.06662, 
    34.77745
);
-- Update Supermarket table with default operating hours and location details
UPDATE Supermarket
SET OperatingHours = '[{"day":"Sunday","openHour":"08:00","closeHour":"20:00"},{"day":"Monday","openHour":"08:00","closeHour":"20:00"},{"day":"Tuesday","openHour":"08:00","closeHour":"20:00"},{"day":"Wednesday","openHour":"08:00","closeHour":"20:00"},{"day":"Thursday","openHour":"08:00","closeHour":"20:00"},{"day":"Friday","openHour":"08:00","closeHour":"20:00"},{"day":"Saturday","openHour":"08:00","closeHour":"20:00"}]',
    Country = 'Unknown',
    City = 'Unknown',
    Street = 'Unknown',
    StreetNumber = '0';
GO

-- Insert mock data into ShopInventory
INSERT INTO ShopInventory (SupermarketID, ItemName, Quantity, Price, Discount, Location, Barcode)
VALUES 
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Apple', 100, 1.99, 0.10, 1, 'barcode-001'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Banana', 150, 0.99, 0.05, 2, 'barcode-002'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Milk', 200, 2.49, 0.20, 3, 'barcode-003'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Bread', 100, 1.50, 0.10, 4, 'barcode-004'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Butter', 80, 3.99, 0.50, 5, 'barcode-005'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Cheese', 120, 4.99, 0.30, 6, 'barcode-006'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Chicken', 90, 5.99, 0.40, 7, 'barcode-007'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Beef', 70, 8.99, 0.70, 8, 'barcode-008'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Fish', 60, 7.99, 0.60, 9, 'barcode-009'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Eggs', 110, 2.99, 0.20, 10, 'barcode-010'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Orange', 120, 1.49, 0.10, 1, 'barcode-011'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Grapes', 100, 2.99, 0.20, 2, 'barcode-012'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Yogurt', 140, 1.99, 0.10, 3, 'barcode-013'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Juice', 80, 3.49, 0.30, 4, 'barcode-014'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Cereal', 60, 4.99, 0.40, 5, 'barcode-015'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Rice', 90, 2.49, 0.15, 6, 'barcode-016'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Pasta', 130, 1.99, 0.10, 7, 'barcode-017'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Tomato', 150, 1.79, 0.10, 8, 'barcode-018'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Potato', 200, 0.99, 0.05, 9, 'barcode-019'),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Onion', 170, 1.29, 0.10, 10, 'barcode-020');
GO

-- Insert mock data into ShoppingList and ShoppingListItem
INSERT INTO ShoppingList (ListID, ListName, BuyerID)
VALUES 
(DEFAULT, 'List1', (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')),
(DEFAULT, 'List2', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')),
(DEFAULT, 'List3', (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')),
(DEFAULT, 'List4', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')),
(DEFAULT, 'List5', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')),
(DEFAULT, 'List6', (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'));
GO

-- Insert mock data into ShoppingListItem
INSERT INTO ShoppingListItem (ListID, ItemName, Quantity)
VALUES 
((SELECT ListID FROM ShoppingList WHERE ListName = 'List1'), 'Apple', 2),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List1'), 'Banana', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List2'), 'Milk', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List2'), 'Bread', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List3'), 'Butter', 2),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List3'), 'Cheese', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List4'), 'Chicken', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List4'), 'Beef', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List5'), 'Fish', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List5'), 'Eggs', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List6'), 'Orange', 3),
((SELECT ListID FROM ShoppingList WHERE ListName = 'List6'), 'Grapes', 1);
GO

-- Insert mock data into BuyerOrder and BuyerOrderItem
INSERT INTO BuyerOrder (BuyerID, TotalAmount, SupermarketID)
VALUES 
((SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com'), 27.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com'), 21.97, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com'), 38.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'), 36.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza')),
((SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'), 40.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza')),
((SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com'), 46.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'));
GO

INSERT INTO BuyerOrderItem (OrderID, ItemID, ItemName, Quantity, Price)
VALUES 
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 27.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-001', 'Apple', 2, 1.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 27.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-002', 'Banana', 1, 0.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 21.97 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-001', 'Apple', 1, 1.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 21.97 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-002', 'Banana', 2, 0.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 38.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-001', 'Apple', 3, 1.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 38.47 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'john.doe@example.com')), 'item-002', 'Banana', 1, 0.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 36.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-006', 'Cheese', 3, 4.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 36.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-007', 'Chicken', 1, 5.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 40.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-006', 'Cheese', 2, 4.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 40.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-007', 'Chicken', 2, 5.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 46.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-006', 'Cheese', 1, 4.99),
((SELECT OrderID FROM BuyerOrder WHERE TotalAmount = 46.96 AND BuyerID = (SELECT UserID FROM [User] WHERE Email = 'mike.johnson@example.com')), 'item-007', 'Chicken', 3, 5.99);
GO

-- Insert mock data into ESP32Position
INSERT INTO ESP32Position (SupermarketID, DeviceName, XCoordinate, YCoordinate)
VALUES
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'esp32_1', 0, 0),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'esp32_2', 0, 600),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'esp32_3', 800, 0),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'esp32_4', 800, 600),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'esp32_1', 0, 0),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'esp32_2', 0, 600),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'esp32_3', 800, 0),
((SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'esp32_4', 800, 600);
GO

-- Insert mock data into Supplier table
INSERT INTO Supplier (UserID, SupplierName)
VALUES 
((SELECT UserID FROM [User] WHERE Email = 'talsabel@example.com'), 'Tal Sabel');
GO

-- Insert mock data into SupplierOrder and SupplierOrderItem
INSERT INTO SupplierOrder (SupplierID, TotalAmount, SupermarketID, Status)
VALUES 
((SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel'), 27.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Done'),
((SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel'), 21.97, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Pending'),
((SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel'), 38.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), 'Cancelled'),
((SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel'), 36.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Done'),
((SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel'), 40.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Pending'),
((SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel'), 46.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), 'Pending');
GO

INSERT INTO SupplierOrderItem (OrderID, ItemID, ItemName, Quantity, Price)
VALUES 
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 27.47 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-001', 'Apple', 2, 1.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 27.47 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-002', 'Banana', 1, 0.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 21.97 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-001', 'Apple', 1, 1.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 21.97 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-002', 'Banana', 2, 0.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 38.47 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-001', 'Apple', 3, 1.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 38.47 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-002', 'Banana', 1, 0.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 36.96 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-006', 'Cheese', 3, 4.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 36.96 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-007', 'Chicken', 1, 5.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 40.96 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-006', 'Cheese', 2, 4.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 40.96 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-007', 'Chicken', 2, 5.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 46.96 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-006', 'Cheese', 1, 4.99),
((SELECT OrderID FROM SupplierOrder WHERE TotalAmount = 46.96 AND SupplierID = (SELECT SupplierID FROM Supplier WHERE SupplierName = 'Tal Sabel')), 'item-007', 'Chicken', 3, 5.99);
GO