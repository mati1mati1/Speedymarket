-- Add new columns for operating hours and detailed address information
ALTER TABLE Supermarket
ADD OperatingHours NVARCHAR(MAX),
    Country NVARCHAR(100),
    City NVARCHAR(100),
    Street NVARCHAR(100),
    StreetNumber NVARCHAR(10);
GO
-- Update all existing records with default values for the new columns
UPDATE Supermarket
SET OperatingHours = '[{"day":"Sunday","openHour":"08:00","closeHour":"20:00"},{"day":"Monday","openHour":"08:00","closeHour":"20:00"},{"day":"Tuesday","openHour":"08:00","closeHour":"20:00"},{"day":"Wednesday","openHour":"08:00","closeHour":"20:00"},{"day":"Thursday","openHour":"08:00","closeHour":"20:00"},{"day":"Friday","openHour":"08:00","closeHour":"20:00"},{"day":"Saturday","openHour":"08:00","closeHour":"20:00"}]',
    Country = 'Unknown',
    City = 'Unknown',
    Street = 'Unknown',
    StreetNumber = '0';

GO
ALTER TABLE Supermarket
DROP COLUMN BranchAddress;
Go