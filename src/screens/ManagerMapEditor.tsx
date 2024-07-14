import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import Section from '../components/Section';
import Entrance from '../components/Entrance';
import '../styles/MapEditor.css';

const ItemTypes = {
  SECTION: 'section',
  ENTRANCE: 'entrance'
};

const ManagerMapEditor: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [entrance, setEntrance] = useState<{ left: number; top: number } | null>(null);
  const [shelfCounter, setShelfCounter] = useState(1);
  const [currentOffset, setCurrentOffset] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapWidth = 800;
  const mapHeight = 600;
  const seller = JSON.parse(sessionStorage.getItem('seller') || '{}');

  useEffect(() => {
        const branchMap = JSON.parse(seller.BranchMap);
        setSections(branchMap.sections || []);
        setEntrance(branchMap.entrance || null);
        debugger
        setShelfCounter(branchMap.sections.length + 1);
  }, []);

  const [, drop] = useDrop({
    accept: [ItemTypes.SECTION, ItemTypes.ENTRANCE],
    hover: (item: any, monitor: DropTargetMonitor) => {
      const delta = monitor.getClientOffset();
      const mapRect = mapRef.current?.getBoundingClientRect();
      if (delta && mapRect) {
        const left = Math.round(delta.x - mapRect.left);
        const top = Math.round(delta.y - mapRect.top);

        setCurrentOffset({ x: left, y: top });
      }
    },
    drop: (item: any, monitor: DropTargetMonitor) => {
      const delta = monitor.getClientOffset();
      const mapRect = mapRef.current?.getBoundingClientRect();
      if (delta && mapRect) {
        const left = Math.round(delta.x - mapRect.left);
        const top = Math.round(delta.y - mapRect.top);

        setCurrentOffset(null); // Reset current offset after drop

        if (item.type === ItemTypes.ENTRANCE) {
          moveEntrance(left, top);
        } else if (item.type === ItemTypes.SECTION) {
          const existingSection = sections.find(section => section.id === item.id);
          if (existingSection) {
            moveSection(item.id, left, top, item.rotation);
          } else {
            addSection(left, top, item.rotation);
          }
        }
      }
      return undefined;
    },
  });

  const addSection = (left: number, top: number, rotation: number) => {
    const adjustedPosition = adjustPosition(shelfCounter, left, top, rotation);
    setSections((sections) => [
      ...sections,
      { id: shelfCounter, name: `מדף`, left: adjustedPosition.left, top: adjustedPosition.top, rotation: rotation, width: 80, height: 40 }
    ]);
    console.log(`Section ${shelfCounter} added at position: ${adjustedPosition.left}, ${adjustedPosition.top}`);
    setShelfCounter(shelfCounter + 1);
  };

  const adjustPosition = (id: number, left: number, top: number, rotation: number) => {
    let adjustedLeft = left;
    let adjustedTop = top;
    let overlap = true;
    const itemWidth = rotation % 180 === 0 ? 80 : 40;
    const itemHeight = rotation % 180 === 0 ? 40 : 80;

    while (overlap) {
      overlap = false;
      sections.forEach(section => {
        if (section.id !== id) {
          const sectionWidth = section.rotation % 180 === 0 ? 80 : 40;
          const sectionHeight = section.rotation % 180 === 0 ? 40 : 80;
          const sectionRight = section.left + sectionWidth;
          const sectionBottom = section.top + sectionHeight;

          const itemRight = adjustedLeft + itemWidth;
          const itemBottom = adjustedTop + itemHeight;

          const isOverlapping = !(sectionRight <= adjustedLeft || section.left >= itemRight || sectionBottom <= adjustedTop || section.top >= itemBottom);

          if (isOverlapping) {
            overlap = true;
            let newLeft = adjustedLeft;
            let newTop = adjustedTop;

            if (adjustedTop < section.top) {
              newTop = section.top - itemHeight;
            } else if (adjustedTop > section.top) {
              newTop = section.top + sectionHeight;
            }

            if (adjustedLeft < section.left) {
              newLeft = section.left - itemWidth;
            } else if (adjustedLeft > section.left) {
              newLeft = section.left + sectionWidth;
            }

            adjustedLeft = newLeft;
            adjustedTop = newTop;
          }
        }
      });
    }

    return { left: adjustedLeft, top: adjustedTop };
  };

  const rotateSection = (id: number) => {
    setSections((sections) =>
      sections.map((section) =>
        section.id === id ? { ...section, rotation: (section.rotation + 90) % 360 } : section
      )
    );
    console.log(`Section ${id} rotated`);
  };

  const moveSection = (id: number, left: number, top: number, rotation: number) => {
    const adjustedPosition = adjustPosition(id, left, top, rotation);
    setSections((sections) =>
      sections.map((section) =>
        section.id === id ? { ...section, left: Math.max(0, Math.min(adjustedPosition.left, mapWidth - (rotation % 180 === 0 ? 80 : 40))), top: Math.max(0, Math.min(adjustedPosition.top, mapHeight - (rotation % 180 === 0 ? 40 : 80))) } : section
      )
    );
    console.log(`Section ${id} moved to new position: ${adjustedPosition.left}, ${adjustedPosition.top}`);
  };

  const moveEntrance = (left: number, top: number) => {
    const adjustedLeft = Math.max(0, Math.min(left, mapWidth - 50));
    const adjustedTop = (adjustedLeft === 0 || adjustedLeft === mapWidth - 50) ? Math.max(0, Math.min(top, mapHeight - 50)) : (top <= 25 || top >= mapHeight - 25 ? top : (top < mapHeight / 2 ? 0 : mapHeight - 50));
    setEntrance({ left: adjustedLeft, top: adjustedTop });
    console.log(`Entrance moved to new position: ${adjustedLeft}, ${adjustedTop}`);
  };

  const saveMapToDB = async () => {
    const mapData = { sections, entrance, mapWidth, mapHeight };

    const response = await fetch('http://localhost:7071/api/SaveMap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ supermarketId: seller.id, mapData })
    });

    if (response.ok) {
      alert('המפה נשמרה בהצלחה');
    } else {
      alert('שגיאה בשמירת המפה');
    }
  };

  return (
    <div>
      <button onClick={saveMapToDB}>שמור מפה</button>
      <div ref={(node) => { if (node) { mapRef.current = node; drop(node); } }} className="map-editor" style={{ position: 'relative', width: `${mapWidth}px`, height: `${mapHeight}px`, border: '1px solid black' }}>
        {sections.map(({ id, name, left, top, rotation, width, height }) => (
          <div key={`section-${id}`} onDoubleClick={() => rotateSection(id)}>
            <Section id={id} name={name} left={left} top={top} rotation={rotation} currentOffset={currentOffset} />
          </div>
        ))}
        {entrance && <Entrance left={entrance.left} top={entrance.top} />}
      </div>
      <div className="sidebar">
        <div onClick={() => addSection(0, 0, 0)}>מדף</div>
        <div onClick={() => !entrance && setEntrance({ left: 0, top: 0 })}>כניסה</div>
      </div>
    </div>
  );
};

export default ManagerMapEditor;
