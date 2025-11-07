// src/components/game/GameBoard.tsx

"use client";

import { boardPath, BoardCell } from '@/data/board';

// Component cho một ô trên Vòng Ngoài
const PathCell = ({ cell, position }: { cell: BoardCell, position: string }) => {
  const cellColors: { [key: string]: string } = {
    start: 'bg-green-700',
    land_deed: 'bg-gray-600',
    black_market: 'bg-purple-800',
    event: 'bg-blue-700',
    police: 'bg-red-800',
    bank: 'bg-yellow-700',
  };

  return (
    <div className={`border border-gray-400 flex items-center justify-center text-center p-1 ${cellColors[cell.type]} ${position}`}>
      <span className="text-xs font-bold">{cell.name}</span>
    </div>
  );
};

// Component cho một ô đất trên Grid Trung tâm
const GridCell = ({ x, y }: { x: number, y: number }) => {
  return (
    <div className="bg-green-900/50 border border-green-700/50 aspect-square">
      {/* Hiển thị quân cờ của người chơi sẽ được thêm vào sau */}
    </div>
  );
};

export default function GameBoard() {
  // Tạo mảng 10x10 cho Grid trung tâm
  const gridCells = Array.from({ length: 100 }, (_, i) => ({
    x: i % 10,
    y: Math.floor(i / 10),
  }));

  // Phân chia 32 ô Vòng Ngoài vào các vị trí trên layout grid 12x12
  const getCellPosition = (index: number): string => {
    if (index >= 0 && index <= 8) return `row-start-1 col-start-${index + 2}`; // Top row
    if (index >= 9 && index <= 16) return `col-start-11 row-start-${index - 7}`; // Right col
    if (index >= 17 && index <= 24) return `row-start-11 col-start-${26 - index}`; // Bottom row
    if (index >= 25 && index <= 31) return `col-start-1 row-start-${34 - index}`; // Left col
    return '';
  };

  return (
    <div className="relative w-[800px] h-[800px] bg-gray-800 p-4">
      <div className="grid grid-cols-12 grid-rows-12 w-full h-full gap-1">
        {/* Render Vòng Ngoài */}
        {boardPath.map((cell, index) => (
          <PathCell key={cell.id} cell={cell} position={getCellPosition(index)} />
        ))}

        {/* Render Grid Trung tâm */}
        <div className="col-start-2 col-span-10 row-start-2 row-span-10 bg-gray-900 grid grid-cols-10 grid-rows-10 gap-px p-px">
          {gridCells.map((cell, i) => (
            <GridCell key={i} x={cell.x} y={cell.y} />
          ))}
        </div>
      </div>
    </div>
  );
}