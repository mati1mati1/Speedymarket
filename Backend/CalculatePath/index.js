const sql = require('mssql');

const config = {
    user: 'SA',
    password: 'Aa123456',
    server: 'localhost',
    port: 1433,
    database: 'MySuperMarketDb',
    options: {
        encrypt: false // Disable SSL for local development
    }
};

const calculatePath = (mapData, shelvesToVisit, context) => {
    try {
        const { sections, entrance, mapWidth, mapHeight } = mapData;
        const path = [];

        const getNeighbors = (x, y) => {
            const neighbors = [];
            if (x > 0) neighbors.push([x - 1, y]);
            if (x < mapWidth - 1) neighbors.push([x + 1, y]);
            if (y > 0) neighbors.push([x, y - 1]);
            if (y < mapHeight - 1) neighbors.push([x, y + 1]);
            return neighbors;
        };

        const isValidMove = (x, y) => {
            for (const section of sections) {
                const sectionWidth = section.rotation % 180 === 0 ? section.width : section.height;
                const sectionHeight = section.rotation % 180 === 0 ? section.height : section.width;
                if (
                    x >= section.left &&
                    x <= section.left + sectionWidth &&
                    y >= section.top &&
                    y <= section.top + sectionHeight
                ) {
                    return false;
                }
            }
            return true;
        };

        const findPath = (start, end) => {
            try {
                const [startX, startY] = start;
                const [endX, endY] = end;
                const queue = [[startX, startY]];
                const cameFrom = {};
                cameFrom[`${startX},${startY}`] = null;

                while (queue.length > 0) {
                    const [currentX, currentY] = queue.shift();

                    if (currentX === endX && currentY === endY) {
                        const path = [];
                        let current = `${endX},${endY}`;
                        while (current) {
                            path.push(current.split(',').map(Number));
                            current = cameFrom[current];
                        }
                        context.log('Path found:', path);
                        return path.reverse();
                    }

                    for (const [nextX, nextY] of getNeighbors(currentX, currentY)) {
                        if (!isValidMove(nextX, nextY) || cameFrom.hasOwnProperty(`${nextX},${nextY}`)) {
                            continue;
                        }
                        queue.push([nextX, nextY]);
                        cameFrom[`${nextX},${nextY}`] = `${currentX},${currentY}`;
                    }
                }

                context.log('No path found from', start, 'to', end);
                return null;
            } catch (err) {
                context.log('Error in findPath:', err);
                throw err;
            }
        };

        const visitShelf = (shelfId) => {
            try {
                const shelf = sections.find(section => section.id === shelfId);
                if (!shelf) {
                    throw new Error(`Shelf with id ${shelfId} not found`);
                }
                const { left, top, rotation } = shelf;
                let entranceX = entrance.left + 25;
                let entranceY = entrance.top + 25;
                if (path.length > 0) {
                    const lastPos = path[path.length - 1];
                    entranceX = lastPos[0];
                    entranceY = lastPos[1];
                }

                let shelfX, shelfY;
                switch (rotation) {
                    case 0:
                        shelfX = left + shelf.width / 2;
                        shelfY = top;
                        break;
                    case 90:
                        shelfX = left;
                        shelfY = top + shelf.height / 2;
                        break;
                    case 180:
                        shelfX = left + shelf.width / 2;
                        shelfY = top + shelf.height;
                        break;
                    case 270:
                        shelfX = left + shelf.width;
                        shelfY = top + shelf.height / 2;
                        break;
                }

                const segmentPath = findPath([entranceX, entranceY], [shelfX, 18]);
                if (segmentPath) {
                    path.push(...segmentPath.slice(1));
                    context.log('Segment path:', segmentPath);
                }
            } catch (err) {
                context.log('Error in visitShelf:', err);
                throw err;
            }
        };

        context.log('Shelves to visit before loop:', shelvesToVisit);
        shelvesToVisit.forEach(visitShelf);

        // Return to entrance
        const lastPos = path[path.length - 1];
        if (lastPos) {
            context.log('Last position before return path:', lastPos);
            const returnPath = findPath([lastPos[0], lastPos[1]], [entrance.left + 25, entrance.top + 25]);
            if (returnPath) {
                path.push(...returnPath.slice(1));
            }
        }

        return path;
    } catch (err) {
        context.log('Error in calculatePath:', err);
        throw err;
    }
};

module.exports = async function (context, req) {
    const { supermarketId, listId } = req.body;

    if (!supermarketId || !listId) {
        context.res = {
            status: 400,
            body: "Please pass a supermarketId and listId in the request body"
        };
        return;
    }

    let branchMap, shoppingList, inventory, missingItems = [], itemsWithLocations = [];

    try {
        await sql.connect(config);
        
        try {
            // Fetch map data
            const mapQuery = `SELECT * FROM Sellers WHERE SellerID = @supermarketId`;
            const mapRequest = new sql.Request();
            mapRequest.input('supermarketId', sql.UniqueIdentifier, supermarketId);
            const mapResult = await mapRequest.query(mapQuery);
            //context.log('Map data fetched:', mapResult.recordset);
            if (mapResult.recordset.length === 0) throw new Error('No map data found for given supermarketId');
            branchMap = JSON.parse(mapResult.recordset[0].BranchMap);
            //context.log('Parsed branch map:', branchMap);
        } catch (err) {
            throw new Error(`Error fetching map data: ${err.message}`);
        }

        try {
            // Fetch shopping list data
            const listQuery = `SELECT * FROM ShoppingList WHERE ListID = @listId`;
            const listRequest = new sql.Request();
            listRequest.input('listId', sql.UniqueIdentifier, listId);
            const listResult = await listRequest.query(listQuery);
            //context.log('Shopping list data fetched:', listResult.recordset);
            if (listResult.recordset.length === 0) throw new Error('No shopping list data found for given listId');
            shoppingList = JSON.parse(listResult.recordset[0].Items);
        } catch (err) {
            throw new Error(`Error fetching shopping list data: ${err.message}`);
        }

        try {
            // Fetch inventory data
            const inventoryQuery = `SELECT * FROM ShopInventory WHERE SellerID = @supermarketId`;
            const inventoryRequest = new sql.Request();
            inventoryRequest.input('supermarketId', sql.UniqueIdentifier, supermarketId);
            const inventoryResult = await inventoryRequest.query(inventoryQuery);
            context.log('Inventory data fetched:', inventoryResult.recordset);
            inventory = inventoryResult.recordset;
        } catch (err) {
            throw new Error(`Error fetching inventory data: ${err.message}`);
        }

        const shelvesToVisit = shoppingList.map(item => {
            const inventoryItem = inventory.find(inv => inv.ItemNumber === item.id);
            context.log(' inventoryItem location', inventoryItem.Location);
            if (!inventoryItem) {
                missingItems.push(item);
                context.log(`Item ${item.id} not found in inventory`);
                return null;
            }
            itemsWithLocations.push({ ...item, location: inventoryItem.Location });
            return parseInt(inventoryItem.Location, 10);
        }).filter(Boolean);

        context.log('Shelves to visit:', shelvesToVisit);

        const path = calculatePath(branchMap, shelvesToVisit, context);
        context.res = {
            status: 200,
            body: { map: branchMap, path, missingItems, itemsWithLocations }
        };
    } catch (err) {
        context.log('Error executing SQL query or calculating path:', err);
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    } finally {
        // Close the database connection
        sql.close();
    }
};
