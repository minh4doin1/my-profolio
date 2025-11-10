// src/app/street-hustle/[roomCode]/GameBoard.tsx
"use client";

import { boardTiles, BoardTile } from './boardData';
import { Home, HelpCircle, Banknote, ShoppingCart, Siren, LandPlot } from 'lucide-react';

type Player = {
  id: string;
  nickname: string;
  position_on_path: number;
  color: string;
};

interface GameBoardProps {
  players: Player[];
}

// Component cho một ô trên bàn cờ (đã nâng cấp)
const Tile = ({ tile, style }: { tile: BoardTile, style: React.CSSProperties }) => {
  const tileTypes = {
    start: { color: 'bg-green-500', icon: <Home /> },
    property: { color: 'bg-gray-500', icon: <LandPlot /> },
    chance: { color: 'bg-blue-500', icon: <HelpCircle /> },
    police: { color: 'bg-red-500', icon: <Siren /> },
    market: { color: 'bg-yellow-500', icon: <ShoppingCart /> },
    bank: { color: 'bg-indigo-500', icon: <Banknote /> },
  };
  const { color, icon } = tileTypes[tile.type];

  return (
    <div style={style} className="border border-black bg-gray-200 flex flex-col overflow-hidden">
      <div className={`w-full h-5 flex-shrink-0 ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div className="flex-grow flex items-center justify-center p-1">
        <span className="text-center text-xs font-bold text-gray-800 leading-tight">{tile.name}</span>
      </div>
    </div>
  );
};

const PlayerPiece = ({ player, index }: { player: Player, index: number }) => {
  const tile = boardTiles[player.position_on_path];
  
  const styles: React.CSSProperties = {
    backgroundColor: player.color,
    transition: 'all 0.7s cubic-bezier(0.45, 0, 0.55, 1)',
    transform: `translate(${index * 6}px, ${index * 6}px)`,
    zIndex: 10 + index,
  };

  // Logic định vị quân cờ dựa trên lưới 10x10
  const TILE_SIZE = 10; // 10%
  if (tile.position === 'bottom') {
    styles.bottom = `${TILE_SIZE / 2 - 3}%`;
    styles.right = `${(tile.id * TILE_SIZE) + (TILE_SIZE / 2) - 3}%`;
  } else if (tile.position === 'left') {
    styles.left = `${TILE_SIZE / 2 - 3}%`;
    styles.bottom = `${((tile.id - 8) * TILE_SIZE) + (TILE_SIZE / 2) - 3}%`;
  } else if (tile.position === 'top') {
    styles.top = `${TILE_SIZE / 2 - 3}%`;
    styles.left = `${((tile.id - 16) * TILE_SIZE) + (TILE_SIZE / 2) - 3}%`;
  } else if (tile.position === 'right') {
    styles.right = `${TILE_SIZE / 2 - 3}%`;
    styles.top = `${((tile.id - 24) * TILE_SIZE) + (TILE_SIZE / 2) - 3}%`;
  }

  return (
    <div
      className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg"
      style={styles}
      title={player.nickname}
    ></div>
  );
};

export default function GameBoard({ players }: GameBoardProps) {
  // NÂNG CẤP GIAO DIỆN: Dùng CSS Grid cho toàn bộ bàn cờ
  return (
    <div className="w-full flex-grow flex items-center justify-center bg-gray-800 p-4 relative">
      <div className="aspect-square w-full max-w-4xl relative">
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {boardTiles.map(tile => {
            const gridStyle: React.CSSProperties = {};
            if (tile.position === 'bottom') {
              gridStyle.gridRowStart = 10;
              gridStyle.gridColumnStart = 10 - tile.id;
            } else if (tile.position === 'left') {
              gridStyle.gridRowStart = 10 - (tile.id - 8);
              gridStyle.gridColumnStart = 1;
            } else if (tile.position === 'top') {
              gridStyle.gridRowStart = 1;
              gridStyle.gridColumnStart = 1 + (tile.id - 16);
            } else if (tile.position === 'right') {
              gridStyle.gridRowStart = 1 + (tile.id - 24);
              gridStyle.gridColumnStart = 10;
            }
            return <Tile key={tile.id} tile={tile} style={gridStyle} />;
          })}
          <div className="col-start-2 col-span-8 row-start-2 row-span-8 bg-green-700 flex justify-center items-center">
             <h1 className="text-4xl font-bold text-white transform -rotate-45">Phố Phường Bát Nháo</h1>
          </div>
        </div>
        {players.map((p, index) => <PlayerPiece key={p.id} player={p} index={index} />)}
      </div>
    </div>
  );
}