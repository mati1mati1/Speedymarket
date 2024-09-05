const sql = require('mssql');
const fs = require('fs');
const path = require('path');

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

function createGrid(sections, width, height, shelvesToVisit) {
    const gridWidth = Math.floor(width);
    const gridHeight = Math.floor(height);
    const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));

    sections.forEach(section => {
        const left = section.left;
        const top = section.top;
        const rotation = section.rotation;
        const sectionWidth = section.width;
        const sectionHeight = section.height;

        const secWidth = (rotation % 180 === 0) ? Math.floor(sectionWidth) : Math.floor(sectionHeight);
        const secHeight = (rotation % 180 === 0) ? Math.floor(sectionHeight) : Math.floor(sectionWidth);

        for (let i = 0; i < secWidth; i++) {
            for (let j = 0; j < secHeight; j++) {
                const gridX = Math.floor(left) + i;
                const gridY = Math.floor(top) + j;
                if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
                    grid[gridY][gridX] = 1;
                }
            }
        }
    });

    sections.forEach(section => {
        if (shelvesToVisit.includes(section.id)) {
            const secTop = section.top;
            const secLeft = section.left;
            const secWidth = section.width;
            const secHeight = section.height;
            let shelfCenter;

            if (section.rotation === 0) {
                shelfCenter = [Math.floor(secTop) - 2, Math.floor((secLeft + secWidth / 2)) + 1];
            } else if (section.rotation === 90) {
                shelfCenter = [Math.floor((secTop + secHeight / 2)), Math.floor((secLeft + secWidth))];
            } else if (section.rotation === 180) {
                shelfCenter = [secTop + secHeight , Math.floor((secLeft + secWidth / 2))];
            } else if (section.rotation === 270) {
                shelfCenter = [Math.floor((secTop + secHeight / 2)) - 1, Math.floor(secLeft) - 2];
            }

            if (shelfCenter[0] >= 0 && shelfCenter[0] < gridHeight && shelfCenter[1] >= 0 && shelfCenter[1] < gridWidth) {
                grid[shelfCenter[0]][shelfCenter[1]] = 2;
            }
        }
    });

    return grid;
}

function bfs(matrix, start) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const distances = {};
    const predecessors = {};
    const queue = [start];

    distances[start] = 0;
    predecessors[start] = null;

    while (queue.length > 0) {
        const [r, c] = queue.shift();
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] !== 1) {
                const key = `${nr},${nc}`;
                if (!(distances.hasOwnProperty(key))) {
                    distances[key] = distances[`${r},${c}`] + 1;
                    predecessors[key] = [r, c];
                    queue.push([nr, nc]);
                }
            }
        }
    }

    return { distances, predecessors };
}

function tspDp(distMatrix, numPoints) {
    const dp = Array.from({ length: 1 << numPoints }, () => Array(numPoints).fill(Infinity));
    dp[1][0] = 0;
    const parent = Array.from({ length: 1 << numPoints }, () => Array(numPoints).fill(-1));

    for (let mask = 0; mask < (1 << numPoints); mask++) {
        for (let u = 0; u < numPoints; u++) {
            if (mask & (1 << u)) {
                for (let v = 0; v < numPoints; v++) {
                    if (!(mask & (1 << v))) {
                        const newMask = mask | (1 << v);
                        if (dp[newMask][v] > dp[mask][u] + distMatrix[u][v]) {
                            dp[newMask][v] = dp[mask][u] + distMatrix[u][v];
                            parent[newMask][v] = u;
                        }
                    }
                }
            }
        }
    }

    let minCost = Infinity;
    let endPoint = -1;
    for (let i = 0; i < numPoints; i++) {
        if (dp[(1 << numPoints) - 1][i] + distMatrix[i][0] < minCost) {
            minCost = dp[(1 << numPoints) - 1][i] + distMatrix[i][0];
            endPoint = i;
        }
    }

    let mask = (1 << numPoints) - 1;
    const path = [];
    while (endPoint !== -1) {
        path.push(endPoint);
        const nextPoint = parent[mask][endPoint];
        mask ^= (1 << endPoint);
        endPoint = nextPoint;
    }

    return path.reverse();
}

function isDirectionChange(prevPoint, currentPoint, nextPoint) {
    const [prevX, prevY] = prevPoint;
    const [currentX, currentY] = currentPoint;
    const [nextX, nextY] = nextPoint;

    return (currentX - prevX) !== (nextX - currentX) || (currentY - prevY) !== (nextY - currentY);
}

function findShortestPath(matrix, entrance) {
    const points = [];
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] === 2) {
                points.push([r, c]);
            }
        }
    }
    points.unshift([entrance.top, entrance.left]); // Ensure entry point is the first point

    const numPoints = points.length;
    const distances = [];
    const predecessors = [];

    for (const point of points) {
        const { distances: dist, predecessors: pred } = bfs(matrix, point);
        distances.push(dist);
        predecessors.push(pred);
    }

    const distMatrix = Array.from({ length: numPoints }, () => Array(numPoints).fill(0));
    for (let i = 0; i < numPoints; i++) {
        for (let j = 0; j < numPoints; j++) {
            distMatrix[i][j] = distances[i][`${points[j][0]},${points[j][1]}`];
        }
    }

    const pathIndices = tspDp(distMatrix, numPoints);

    let fullPath = [];
    for (let i = 0; i < pathIndices.length - 1; i++) {
        const startIndex = pathIndices[i];
        const endIndex = pathIndices[i + 1];
        const startPoint = points[startIndex];
        const endPoint = points[endIndex];
        let current = endPoint;
        const segmentPath = [];
        while (current.toString() !== startPoint.toString()) {
            segmentPath.push(current);
            current = predecessors[startIndex][`${current[0]},${current[1]}`];
        }
        segmentPath.push(startPoint);
        fullPath = [...fullPath, ...segmentPath.reverse()];
    }

    // Ensure the path starts with the entrance
    if (fullPath[0].toString() !== [entrance.top, entrance.left].toString()) {
        fullPath.unshift([entrance.top, entrance.left]);
    }

    // // Find the return path to the entrance
    // const lastPoint = fullPath[fullPath.length - 1];
    // const { distances: returnDistances, predecessors: returnPredecessors } = bfs(matrix, lastPoint);
    // let current = [entrance.top, entrance.left];
    // const returnPath = [];
    // while (current.toString() !== lastPoint.toString()) {
    //     returnPath.push(current);
    //     current = returnPredecessors[`${current[0]},${current[1]}`];
    // }
    // returnPath.push(lastPoint);
    // fullPath = [...fullPath, ...returnPath.reverse()];

    console.log('Full Path:', fullPath);

    // Collect key points where direction changes
    const keyPointsPath = [fullPath[0]];
    for (let i = 1; i < fullPath.length - 1; i++) {
        if (isDirectionChange(fullPath[i - 1], fullPath[i], fullPath[i + 1])) {
            keyPointsPath.push(fullPath[i]);
        }
    }
    keyPointsPath.push(fullPath[fullPath.length - 1]);

    // Mark the path on the grid
    fullPath.forEach(([r, c]) => {
        if (matrix[r][c] === 0 || matrix[r][c] === 2) {
            matrix[r][c] = 3; // Using 3 to indicate the path
        }
    });

    return { keyPointsPath, matrixWithPath: matrix };
}

function writeMatrixToFile(matrix, filename) {
    const filePath = path.join(__dirname, filename);
    const data = matrix.map(row => row.join(' ')).join('\n');
    fs.writeFileSync(filePath, data, 'utf8');
}

function mapToGridPoint(point, mapWidth, mapHeight, gridWidth, gridHeight) {
    const xRatio = gridWidth / mapWidth;
    const yRatio = gridHeight / mapHeight;
    return [Math.floor(point[0] * xRatio), Math.floor(point[1] * yRatio)];
}

module.exports = async function (context, req) {
    const { supermarketId, listId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    console.log( req.body);
    if (!supermarketId) {
        context.res = {
            status: 400,
            body: "Please pass a supermarketId in the request body"
        };
        return;
    }

    let branchMap, shoppingList, inventory, missingItems = [], itemsWithLocations = [];

    try {
        await sql.connect(config);

        try {
            const mapQuery = `SELECT * FROM Supermarket WHERE SupermarketID = @supermarketId`;
            const mapRequest = new sql.Request();
            mapRequest.input('supermarketId', sql.UniqueIdentifier, supermarketId);
            const mapResult = await mapRequest.query(mapQuery);
            if (mapResult.recordset.length === 0) throw new Error('No map data found for given supermarketId');
            branchMap = JSON.parse(mapResult.recordset[0].BranchMap);
        } catch (err) {
            throw new Error(`Error fetching map data: ${err.message}`);
        }
        console.log("listId " +  listId);
        if(!listId || listId === ''){
            context.res = {
                status: 200,
                body: { map: branchMap}
            };
            return;
        }
        try {
            const listQuery = `SELECT * FROM ShoppingListItem WHERE ListID = @listId`;
            const listRequest = new sql.Request();
            listRequest.input('listId', sql.UniqueIdentifier, listId);
            const listResult = await listRequest.query(listQuery);
            if (listResult.length === 0) {
                context.res = {
                    status: 200,
                    body: { map: branchMap}
                };
            } else {
                shoppingList = listResult.recordset;
                context.log('Shopping List:', shoppingList);
            }
        } catch (err) {
            throw new Error(`Error fetching shopping list data: ${err.message}`);
        }

        try {
            const inventoryQuery = `SELECT * FROM ShopInventory WHERE SupermarketID = @supermarketId`;
            const inventoryRequest = new sql.Request();
            inventoryRequest.input('supermarketId', sql.UniqueIdentifier, supermarketId);
            const inventoryResult = await inventoryRequest.query(inventoryQuery);
            inventory = inventoryResult.recordset;
        } catch (err) {
            throw new Error(`Error fetching inventory data: ${err.message}`);
        }

        const shelvesToVisit = shoppingList.map(item => {
            const inventoryItem = inventory.find(inv => inv.ItemName === item.ItemName);
            if (!inventoryItem) {
                context.log(`Missing item: ${item.ItemName}`);
                missingItems.push(item);
                return null;
            }
            const section = branchMap.sections.find(section => section.id === parseInt(inventoryItem.Location, 10));
            if (section) {
                let location;
                switch (section.rotation) {
                    case 0:
                        location = { x: section.left + section.width / 2, y: section.top + section.height / 2 };
                        break;
                    case 90:
                        location = { x: section.left + section.height / 2, y: section.top + section.width / 2 };
                        break;
                    case 180:
                        location = { x: section.left + section.width / 2, y: section.top + section.height / 2 };
                        break;
                    case 270:
                        location = { x: section.left + section.height / 2, y: section.top + section.width / 2 };
                        break;
                }
                itemsWithLocations.push({
                    ...item,
                    location,
                    shelf: section.id
                });
            }
            return parseInt(inventoryItem.Location, 10);
        }).filter(Boolean);

        if (shelvesToVisit.length === 0) {
            context.res = {
                status: 200,
                body: { map: branchMap, missingItems, itemsWithLocations }
            };
            return;
        }
        const grid = createGrid(branchMap.sections, branchMap.mapWidth, branchMap.mapHeight, shelvesToVisit);

        let { keyPointsPath, matrixWithPath } = findShortestPath(grid, branchMap.entrance);
        context.log('Key points path found:', keyPointsPath);
        writeMatrixToFile(matrixWithPath, 'matrix_with_path.txt');

        const pathInMapCoordinates = keyPointsPath.map(point => mapToGridPoint(point, branchMap.mapWidth, branchMap.mapHeight, grid[0].length, grid.length));
        const entry = branchMap.entrance;
        if (keyPointsPath) {
            context.res = {
                status: 200,
                body: { map: branchMap, path: keyPointsPath, missingItems, itemsWithLocations, entry }
            };
        } else {
            context.res = {
                status: 500,
                body: 'Failed to calculate path'
            };
        }
    } catch (err) {
        context.log('Error executing SQL query or calculating path:', err);
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    } finally {
        sql.close();
    }
};
