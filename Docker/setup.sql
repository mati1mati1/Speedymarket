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
    Latitude DECIMAL(9, 5) NOT NULL,
    Longitude DECIMAL(9, 5) NOT NULL,
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
    Quantity INT NOT NULL CHECK (Quantity > 0)
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

INSERT INTO [User] (UserName, FirstName, LastName, Email, PhoneNumber, UserType)
VALUES 
('johndoe', 'John', 'Doe', 'john.doe@example.com', '123-456-7890', 'Buyer'),
('mikejohnson', 'Mike', 'Johnson', 'mike.johnson@example.com', '123-456-7891', 'Buyer'),
('janesmith', 'Jane', 'Smith', 'jane.smith@example.com', '123-456-7892', 'Seller'),
('emilydavis', 'Emily', 'Davis', 'emily@example.com', '987-456-7893', 'Seller');
GO


-- Insert mock data into Supermarket table using the UserID of sellers
-- INSERT INTO Supermarket 
--     (UserID, BranchName, BranchMap, WiFiPassword, WiFiSSID, Country, City, Street, StreetNumber, Latitude, Longitude)
-- VALUES 
-- (
--     (SELECT UserID FROM [User] WHERE Email = 'jane.smith@example.com'), 
--     'Main Street Store', 
--     '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"name":"מדף","left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"name":"מדף","left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"name":"מדף","left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"name":"מדף","left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"name":"מדף","left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"name":"מדף","left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"name":"מדף","left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"name":"מדף","left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"name":"מדף","left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"name":"מדף","left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"name":"מדף","left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"name":"מדף","left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"name":"מדף","left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"name":"מדף","left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 
--     'supermarket_password', 
--     'supermarket_ssid', 
--     '{"id":106,"iso2":"IL","name":"Israel"', 
--     '{"name":"Tel Aviv","id":57564}',
--     '{"id":154741757,"name":"נצח ישראל"}', 
--     '11', 
--     32.07773, 
--      34.77969
-- ),
-- (
--     (SELECT UserID FROM [User] WHERE Email = 'emily.davis@example.com'), 
--     'Market Plaza', 
--     '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"name":"מדף","left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"name":"מדף","left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"name":"מדף","left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"name":"מדף","left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"name":"מדף","left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"name":"מדף","left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"name":"מדף","left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"name":"מדף","left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"name":"מדף","left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"name":"מדף","left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"name":"מדף","left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"name":"מדף","left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"name":"מדף","left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"name":"מדף","left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 
--     'market_password', 
--     'supermarket_ssid', 
--     '{"id":106,"iso2":"IL","name":"Israel"', 
--     '{"name":"Tel Aviv","id":57564}',
--     '{"id":154741757,"name":"שדרות רוטשילד"}', 
--     '10', 
--     32.06662, 
--     34.77745
-- );
INSERT INTO Supermarket (UserID, BranchName, Barcode, Country, City, Street, StreetNumber, BranchMap, Latitude, Longitude, WiFiPassword, WiFiSSID)
VALUES 
((SELECT UserID FROM [User] WHERE UserName = 'janesmith'), 'Main Street Store', '123456789', 'USA', 'New York', 'Main Street', '100', 'Map1', 40.7128, -74.0060, 'password123', 'MainStreetWiFi'),
((SELECT UserID FROM [User] WHERE UserName = 'emilydavis'), 'Market Plaza', '987654321', 'USA', 'Los Angeles', 'Market Street', '200', 'Map2', 34.0522, -118.2437, 'password456', 'MarketPlazaWiFi');
GO

-- Update OperatingHours and other fields
UPDATE Supermarket
SET OperatingHours = '[{"day":"Sunday","openHour":"08:00","closeHour":"20:00"},{"day":"Monday","openHour":"08:00","closeHour":"20:00"},{"day":"Tuesday","openHour":"08:00","closeHour":"20:00"},{"day":"Wednesday","openHour":"08:00","closeHour":"20:00"},{"day":"Thursday","openHour":"08:00","closeHour":"20:00"},{"day":"Friday","openHour":"08:00","closeHour":"20:00"},{"day":"Saturday","openHour":"08:00","closeHour":"20:00"}]'
WHERE BranchName = 'Main Street Store';
GO

UPDATE Supermarket
SET OperatingHours = '[{"day":"Sunday","openHour":"09:00","closeHour":"18:00"},{"day":"Monday","openHour":"09:00","closeHour":"18:00"},{"day":"Tuesday","openHour":"09:00","closeHour":"18:00"},{"day":"Wednesday","openHour":"09:00","closeHour":"18:00"},{"day":"Thursday","openHour":"09:00","closeHour":"18:00"},{"day":"Friday","openHour":"09:00","closeHour":"18:00"},{"day":"Saturday","openHour":"09:00","closeHour":"18:00"}]'
WHERE BranchName = 'Market Plaza';
GO

-- Update Supermarket table with default operating hours and location details
-- UPDATE Supermarket
-- SET OperatingHours = '[{"day":"Sunday","openHour":"08:00","closeHour":"20:00"},{"day":"Monday","openHour":"08:00","closeHour":"20:00"},{"day":"Tuesday","openHour":"08:00","closeHour":"20:00"},{"day":"Wednesday","openHour":"08:00","closeHour":"20:00"},{"day":"Thursday","openHour":"08:00","closeHour":"20:00"},{"day":"Friday","openHour":"08:00","closeHour":"20:00"},{"day":"Saturday","openHour":"08:00","closeHour":"20:00"}]',
--     Country = 'Unknown',
--     City = 'Unknown',
--     Street = 'Unknown',
--     StreetNumber = '0';
-- GO

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
INSERT INTO ShoppingList (ListName, BuyerID)
VALUES 
('Johns Weekly List', (SELECT UserID FROM [User] WHERE UserName = 'johndoe')),
('Mikes Grocery List', (SELECT UserID FROM [User] WHERE UserName = 'mikejohnson'));
GO


-- Insert mock data into ShoppingListItem
INSERT INTO ShoppingListItem (ListID, ItemName, Quantity)
VALUES 
((SELECT ListID FROM ShoppingList WHERE ListName = 'Johns Weekly List'), 'Milk', 2),
((SELECT ListID FROM ShoppingList WHERE ListName = 'Johns Weekly List'), 'Bread', 1),
((SELECT ListID FROM ShoppingList WHERE ListName = 'Mikes Grocery List'), 'Eggs', 12),
((SELECT ListID FROM ShoppingList WHERE ListName = 'Mikes Grocery List'), 'Butter', 1);
GO


-- Insert mock data into BuyerOrder and BuyerOrderItem
INSERT INTO BuyerOrder (BuyerID, TotalAmount, SupermarketID, SessionId)
VALUES 
((SELECT UserID FROM [User] WHERE UserName = 'johndoe'), 27.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), NEWID()),
((SELECT UserID FROM [User] WHERE UserName = 'johndoe'), 21.97, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Main Street Store'), NEWID()),
((SELECT UserID FROM [User] WHERE UserName = 'mikejohnson'), 38.47, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), NEWID()),
((SELECT UserID FROM [User] WHERE UserName = 'mikejohnson'), 36.96, (SELECT SupermarketID FROM Supermarket WHERE BranchName = 'Market Plaza'), NEWID());
GO

INSERT INTO BuyerOrderItem (OrderID, ItemID, ItemName, Quantity, Price)
VALUES 
((SELECT OrderID FROM BuyerOrder WHERE BuyerID = (SELECT UserID FROM [User] WHERE UserName = 'johndoe') AND TotalAmount = 27.47), 'ITEM001', 'Apples', 3, 3.50),
((SELECT OrderID FROM BuyerOrder WHERE BuyerID = (SELECT UserID FROM [User] WHERE UserName = 'johndoe') AND TotalAmount = 21.97), 'ITEM002', 'Bananas', 5, 2.50),
((SELECT OrderID FROM BuyerOrder WHERE BuyerID = (SELECT UserID FROM [User] WHERE UserName = 'mikejohnson') AND TotalAmount = 38.47), 'ITEM003', 'Oranges', 4, 4.25),
((SELECT OrderID FROM BuyerOrder WHERE BuyerID = (SELECT UserID FROM [User] WHERE UserName = 'mikejohnson') AND TotalAmount = 36.96), 'ITEM004', 'Grapes', 2, 5.00);
GO


