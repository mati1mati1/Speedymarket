import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  ENTRANCE: 'entrance'
};

interface EntranceProps {
  left: number;
  top: number;
}

const Entrance: React.FC<EntranceProps> = ({ left, top }) => {
  const [{ isDraggingItem }, drag] = useDrag(() => ({
    type: ItemTypes.ENTRANCE,
    item: { type: ItemTypes.ENTRANCE, left, top },
    collect: (monitor) => ({
      isDraggingItem: monitor.isDragging(),
    }),
  }), [left, top]);

  return (
    <div
      ref={drag}
      className="entrance"
      style={{
        position: 'absolute',
        left,
        top,
        width: '50px',
        height: '50px',
        opacity: isDraggingItem ? 0.5 : 1
      }}
    >
      כניסה
    </div>
  );
};

export default Entrance;
