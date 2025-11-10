// src/app/street-hustle/[roomCode]/GameUI.tsx
"use client";

import { Dices, MapPin, Building2 } from 'lucide-react';

type Land = { id: string; x_coord: number; y_coord: number; };
type BusinessTile = { id: string; tile_type: string; };

interface GameUIProps {
  myLands: Land[];
  myBusinessTiles: BusinessTile[];
  isMyTurn: boolean;
  onRollDice: () => void;
  currentTurnPlayerName: string;
  error: string;
}

export default function GameUI({
  myLands,
  myBusinessTiles,
  isMyTurn,
  onRollDice,
  currentTurnPlayerName,
  error
}: GameUIProps) {
  return (
    <div className="w-full bg-gray-900 p-4 text-white flex justify-between items-center flex-shrink-0 border-t-2 border-blue-500 shadow-lg">
      {/* Phần HUD Tài sản (Bên trái) */}
      <div className="flex-grow grid grid-cols-2 gap-x-6">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MapPin className="text-green-400" />
            Sổ Đỏ ({myLands.length})
          </h3>
          <div className="flex flex-wrap gap-2 mt-2 h-16 overflow-y-auto p-1 bg-black/20 rounded">
            {myLands.length > 0 ? myLands.map(land => (
              <span key={land.id} className="bg-green-800 text-green-200 px-2 py-1 rounded text-sm font-mono">
                {String.fromCharCode(65 + land.x_coord)}{land.y_coord + 1}
              </span>
            )) : <p className="text-gray-500 text-sm italic">Chưa có sổ đỏ...</p>}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Building2 className="text-yellow-400" />
            Kinh Doanh ({myBusinessTiles.length})
          </h3>
          <div className="flex flex-wrap gap-2 mt-2 h-16 overflow-y-auto p-1 bg-black/20 rounded">
            {myBusinessTiles.length > 0 ? myBusinessTiles.map(tile => (
              <span key={tile.id} className="bg-yellow-800 text-yellow-200 px-2 py-1 rounded text-sm capitalize">
                {tile.tile_type.replace('_', ' ')}
              </span>
            )) : <p className="text-gray-500 text-sm italic">Chưa có mảnh ghép...</p>}
          </div>
        </div>
      </div>

      {/* Phần Điều khiển (Bên phải) */}
      <div className="w-72 flex-shrink-0 ml-6 flex flex-col items-center">
        <div>
          <h2 className="text-xl text-center">Lượt của: <span className="font-bold text-blue-400">{currentTurnPlayerName}</span></h2>
          {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
        </div>
        <button
          onClick={onRollDice}
          disabled={!isMyTurn}
          className="w-full mt-2 px-6 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          <Dices />
          {isMyTurn ? "Tung Xúc xắc" : "Đợi Lượt"}
        </button>
      </div>
    </div>
  );
}