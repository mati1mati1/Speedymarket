import React from 'react';
import { Stack } from 'expo-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Layout() {
  console.log("Layout component rendered");
  return (
    <DndProvider backend={HTML5Backend}>
      <Stack />
    </DndProvider>
  );
}
