const sql = require('mssql');

const config = {
    user: 'SA',
    password: 'Aa123456',
    server: 'localhost',
    port: 1433,
    database: 'MySuperMarketDb',
    options: {
      encrypt: false 
    }
};
module.exports = async function (context, req) {
    const { supermarketId, wifiData } = req.body;

    if (!supermarketId || !wifiData) {
        context.res = {
            status: 400,
            body: "Please pass a supermarketId and wifiData in the request body"
        };
        return;
    }

    try {
        await sql.connect(config);

        const result = await sql.query`SELECT DeviceName, XCoordinate, YCoordinate FROM ESP32Position WHERE SupermarketID = ${supermarketId}`;
        const esp32Positions = {};
        result.recordset.forEach(record => {
            esp32Positions[record.DeviceName] = { x: record.XCoordinate, y: record.YCoordinate };
        });

        context.log('ESP32 Positions:', esp32Positions);

        const estimateDistanceFromRSSI = (rssi) => {
            const txPower = -59; // typical RSSI at 1 meter
            if (rssi == 0) {
                return -1.0;
            }
            const ratio = rssi * 1.0 / txPower;
            if (ratio < 1.0) {
                return Math.pow(ratio, 10);
            } else {
                const distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
                return distance;
            }
        };

        const distances = {};
        wifiData.forEach(network => {
            if (esp32Positions[network.ssid]) {
                distances[network.ssid] = estimateDistanceFromRSSI(network.rssi);
            }
        });

        context.log('Distances:', distances);

        const calculatePosition = (distances, positions) => {
            const beacons = Object.keys(distances).map(key => ({
                x: positions[key].x,
                y: positions[key].y,
                distance: distances[key]
            }));

            if (beacons.length < 3) {
                throw new Error("At least three beacons are required for trilateration.");
            }

            const { x: x1, y: y1, distance: r1 } = beacons[0];
            const { x: x2, y: y2, distance: r2 } = beacons[1];
            const { x: x3, y: y3, distance: r3 } = beacons[2];

            const A = 2 * x2 - 2 * x1;
            const B = 2 * y2 - 2 * y1;
            const C = r1 * r1 - r2 * r2 - x1 * x1 + x2 * x2 - y1 * y1 + y2 * y2;
            const D = 2 * x3 - 2 * x2;
            const E = 2 * y3 - 2 * y2;
            const F = r2 * r2 - r3 * r3 - x2 * x2 + x3 * x3 - y2 * y2 + y3 * y3;

            const x = (C * E - F * B) / (E * A - B * D);
            const y = (C * D - A * F) / (B * D - A * E);

            return { x, y };
        };

        const estimatedPosition = calculatePosition(distances, esp32Positions);
        context.log('Estimated Position:', estimatedPosition);

        context.res = {
            status: 200,
            body: { location: estimatedPosition }
        };
    } catch (error) {
        context.log('Error:', error);
        context.res = {
            status: 500,
            body: `Error: ${error.message}`
        };
    } finally {
        sql.close();
    }
};
