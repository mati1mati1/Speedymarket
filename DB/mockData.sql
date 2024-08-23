USE MySuperMarketDb;
GO

-- Insert mock data into Users table
INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, UserType, Username)
VALUES 
('John', 'Doe', 'john.doe@example.com', '1234567890', 'Buyer', 'johndoe'),
('Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Seller', 'janesmith'),
('Mike', 'Johnson', 'mike.johnson@example.com', '1122334455', 'Buyer', 'mikejohnson'),
('Emily', 'Davis', 'emily.davis@example.com', '5566778899', 'Seller', 'emilydavis');

-- Insert mock data into Sellers table using the UserID of sellers
INSERT INTO Sellers (SellerID, BranchName, BranchAddress, BranchMap, Location)
VALUES 
((SELECT UserID FROM Users WHERE Email = 'jane.smith@example.com'), 'Main Street Store', '123 Main St', '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"name":"מדף","left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"name":"מדף","left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"name":"מדף","left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"name":"מדף","left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"name":"מדף","left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"name":"מדף","left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"name":"מדף","left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"name":"מדף","left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"name":"מדף","left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"name":"מדף","left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"name":"מדף","left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"name":"מדף","left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"name":"מדף","left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"name":"מדף","left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 'Los Angeles'),
((SELECT UserID FROM Users WHERE Email = 'emily.davis@example.com'), 'Market Plaza', '456 Market St', '{"sections":[{"id":1,"name":"מדף","left":115,"top":377,"rotation":270,"width":80,"height":40},{"id":2,"name":"מדף","left":25,"top":372,"rotation":90,"width":80,"height":40},{"id":3,"name":"מדף","left":23,"top":452,"rotation":90,"width":80,"height":40},{"id":4,"name":"מדף","left":115,"top":459,"rotation":270,"width":80,"height":40},{"id":5,"name":"מדף","left":578,"top":176,"rotation":180,"width":80,"height":40},{"id":6,"name":"מדף","left":713,"top":180,"rotation":180,"width":80,"height":40},{"id":7,"name":"מדף","left":708,"top":269,"rotation":0,"width":80,"height":40},{"id":8,"left":558,"top":274,"rotation":0,"width":80,"height":40},{"id":9,"left":715,"top":361,"rotation":0,"width":80,"height":40},{"id":10,"left":562,"top":358,"rotation":0,"width":80,"height":40},{"id":11,"left":202,"top":355,"rotation":0,"width":80,"height":40},{"id":12,"left":215,"top":476,"rotation":0,"width":80,"height":40},{"id":13,"left":163,"top":192,"rotation":0,"width":80,"height":40},{"id":14,"left":37,"top":195,"rotation":0,"width":80,"height":40},{"id":15,"left":164,"top":235,"rotation":180,"width":80,"height":40},{"id":16,"left":33,"top":235,"rotation":180,"width":80,"height":40},{"id":17,"left":379,"top":156,"rotation":0,"width":80,"height":40},{"id":18,"left":388,"top":83,"rotation":180,"width":80,"height":40},{"id":19,"left":431,"top":471,"rotation":180,"width":80,"height":40},{"id":20,"left":418,"top":342,"rotation":180,"width":80,"height":40},{"id":21,"left":428,"top":429,"rotation":0,"width":80,"height":40}],"entrance":{"left":404,"top":550},"mapWidth":800,"mapHeight":600}', 'San Francisco');

-- Insert mock data into ShopInventory
INSERT INTO ShopInventory (SellerID, ItemName, Quantity, Price, Discount, Location)
VALUES 
((SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store'), 'item-001', 100, 10.99, 0.99, 1),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store'), 'item-002', 200, 5.49, 0.49, 2),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store'), 'item-003', 150, 7.99, 0.79, 3),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store'), 'item-004', 80, 12.99, 1.29, 4),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store'), 'item-005', 50, 15.99, 2.49, 5),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'), 'item-006', 90, 6.99, 0.69, 6),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'), 'item-007', 120, 8.49, 0.89, 7),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'), 'item-008', 110, 9.99, 1.09, 8),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'), 'item-009', 140, 4.99, 0.49, 9),
((SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'), 'item-010', 130, 3.99, 0.39, 10);

-- Insert mock data into ShoppingList
INSERT INTO ShoppingList (BuyerID, Items)
VALUES 
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"ItemName": "item-001", "ItemName": "Milk", "Quantity": 2}, {"ItemName": "item-002", "ItemName": "Bread", "Quantity": 1}]'),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"ItemName": "item-006", "ItemName": "Tomatoes", "Quantity": 3}, {"ItemName": "item-007", "ItemName": "Cucumbers", "Quantity": 1}]');

-- Insert mock data into BuyerOrders
INSERT INTO BuyerOrders (BuyerID, Items, TotalAmount, SellerID)
VALUES 
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"ItemName": "item-001", "ItemName": "Milk", "Quantity": 2, "Price": 10.99}, {"ItemName": "item-002", "ItemName": "Bread", "Quantity": 1, "Price": 5.49}]', 27.47, (SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"ItemName": "item-001", "ItemName": "Milk", "Quantity": 1, "Price": 10.99}, {"ItemName": "item-002", "ItemName": "Bread", "Quantity": 2, "Price": 5.49}]', 21.97, (SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM Users WHERE Email = 'john.doe@example.com'), '[{"ItemName": "item-001", "ItemName": "Milk", "Quantity": 3, "Price": 10.99}, {"ItemName": "item-002", "ItemName": "Bread", "Quantity": 1, "Price": 5.49}]', 38.47, (SELECT SellerID FROM Sellers WHERE BranchName = 'Main Street Store')),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"ItemName": "item-006", "ItemName": "Tomatoes", "Quantity": 3, "Price": 7.99}, {"ItemName": "item-007", "ItemName": "Cucumbers", "Quantity": 1, "Price": 8.49}]', 36.96, (SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza')),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"ItemName": "item-006", "ItemName": "Tomatoes", "Quantity": 2, "Price": 7.99}, {"ItemName": "item-007", "ItemName": "Cucumbers", "Quantity": 2, "Price": 8.49}]', 40.96, (SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza')),
((SELECT UserID FROM Users WHERE Email = 'mike.johnson@example.com'), '[{"ItemName": "item-006", "ItemName": "Tomatoes", "Quantity": 1, "Price": 7.99}, {"ItemName": "item-007", "ItemName": "Cucumbers", "Quantity": 3, "Price": 8.49}]', 46.96, (SELECT SellerID FROM Sellers WHERE BranchName = 'Market Plaza'));


