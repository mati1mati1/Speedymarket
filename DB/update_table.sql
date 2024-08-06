-- Add the new column to the ShopInventory table
ALTER TABLE ShopInventory
ADD OperatingHours NVARCHAR(MAX);

-- Update all existing records with the default OperatingHours value
UPDATE ShopInventory
SET OperatingHours = '[{"day":"Sunday","openHour":"08:00","closeHour":"20:00"},{"day":"Monday","openHour":"08:00","closeHour":"20:00"},{"day":"Tuesday","openHour":"08:00","closeHour":"20:00"},{"day":"Wednesday","openHour":"08:00","closeHour":"20:00"},{"day":"Thursday","openHour":"08:00","closeHour":"20:00"},{"day":"Friday","openHour":"08:00","closeHour":"20:00"},{"day":"Saturday","openHour":"08:00","closeHour":"20:00"}]';

-- Add new columns for the detailed address information
ALTER TABLE ShopInventory
ADD Country NVARCHAR(100),
    City NVARCHAR(100),
    Street NVARCHAR(100),
    StreetNumber NVARCHAR(10);

-- Optionally, update existing records with default values if needed
UPDATE ShopInventory
SET Country = 'Unknown',
    City = 'Unknown',
    Street = 'Unknown',
    StreetNumber = '0';

-- Drop the old Location column
ALTER TABLE ShopInventory
DROP COLUMN Location;
