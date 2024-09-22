import React from 'react';
import Svg, { Line } from 'react-native-svg';

interface PathDrawerProps {
  path: number[][];
  mapWidth: number;
  mapHeight: number;
}

const PathDrawer: React.FC<PathDrawerProps> = ({ path, mapWidth, mapHeight }) => {
    if (!path || path.length === 0) return null;

    const mapToScreenCoordinates = (gridPoint: number[], gridWidth: number, gridHeight: number, mapWidth: number, mapHeight: number) => {
      const xRatio = mapWidth / gridWidth;
      const yRatio = mapHeight / gridHeight;
      return [gridPoint[1] * xRatio, gridPoint[0] * yRatio];
    };

    return (
      <Svg style={{ position: 'absolute', top: 0, left: 0, width: mapWidth, height: mapHeight }}>
        {path.slice(1).map((point, index) => {
          const prevPoint = path[index];
          const currentPoint = point;

          if (!prevPoint || !currentPoint) return null;

          const [x1, y1] = mapToScreenCoordinates(prevPoint, mapWidth, mapHeight, mapWidth, mapHeight);
          const [x2, y2] = mapToScreenCoordinates(currentPoint, mapWidth, mapHeight, mapWidth, mapHeight);

          if (x1 >= 0 && x1 <= mapWidth && y1 >= 0 && y1 <= mapHeight &&
              x2 >= 0 && x2 <= mapWidth && y2 >= 0 && y2 <= mapHeight) {
            return (
              <Line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="red"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            );
          } else {
            console.error(`Point out of bounds: (${x1}, ${y1}) to (${x2}, ${y2})`);
            return null;
          }
        })}
      </Svg>
    );
};

export default PathDrawer;
