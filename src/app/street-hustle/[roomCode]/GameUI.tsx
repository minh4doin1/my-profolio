// src/app/street-hustle/[roomCode]/GameUI.tsx
"use client";

import { Dices, MapPin, Building2, Handshake, Coins, Hammer } from 'lucide-react';

// Type Definitions
type Land = { id: string; x_coord: number; y_coord: number; };
type BusinessTile = { id: string; tile_type: string; };
type GamePhase = 'lobby' | 'movement' | 'trading' | 'building' | 'income';

interface GameUIProps {
  myPlayerGold: number;
  myLands: Land[];
  myBusinessTiles: BusinessTile[];
  isMyTurn: boolean;
  onRollDice: () => void;
  onEndBuildingTurn: () => void;
  currentTurnPlayerName: string;
  error: string;
  phase: GamePhase;
  onOpenTrade: () => void;
  onSelectTile: (tileId: string) => void;
  selectedTileId: string | null;
}

export default function GameUI({
  myPlayerGold,
  myLands,
  myBusinessTiles,
  isMyTurn,
  onRollDice,
  onEndBuildingTurn,
  currentTurnPlayerName,
  error,
  phase,
  onOpenTrade,
  onSelectTile,
  selectedTileId
}: GameUIProps) {
  const canBuild = isMyTurn && phase === 'building';

  return (
    <div className="w-full bg-gray-900 p-4 text-white flex justify-between items-center flex-shrink-0 border-t-2 border-blue-500 shadow-lg z-10">
      {/* Phần HUD Tài sản (Bên trái) */}
      <div className="flex-grow grid grid-cols-3 gap-x-6">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2"><Coins className="text-yellow-400" />Vàng</h3>
          <p className="text-2xl font-bold mt-2">{myPlayerGold.toLocaleString('en-US')}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="text-green-400" />Sổ Đỏ ({myLands.length})</h3>
          <div className="flex flex-wrap gap-2 mt-2 h-16 overflow-y-auto p-1 bg-black/20 rounded">
            {myLands.length > 0 ? myLands.map(land => (
              <span key={land.id} className="bg-green-800 text-green-200 px-2 py-1 rounded text-sm font-mono">
                {String.fromCharCode(65 + land.x_coord)}{land.y_coord + 1}
              </span>
            )) : <p className="text-gray-500 text-sm italic">Chưa có...</p>}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2"><Building2 className="text-purple-400" />Kinh Doanh ({myBusinessTiles.length})</h3>
          <div className="flex flex-wrap gap-2 mt-2 h-16 overflow-y-auto p-1 bg-black/20 rounded">
            {myBusinessTiles.length > 0 ? myBusinessTiles.map(tile => (
              <button 
                key={tile.id} 
                onClick={() => canBuild && onSelectTile(tile.id)}
                disabled={!canBuild}
                className={`bg-purple-800 text-purple-200 px-2 py-1 rounded text-sm capitalize transition-all
                  ${canBuild ? 'cursor-pointer hover:bg-purple-700' : 'cursor-not-allowed opacity-50'}
                  ${selectedTileId === tile.id ? 'ring-2 ring-yellow-400' : ''}
                `}
              >
                {tile.tile_type.replace('_', ' ')}
              </button>
            )) : <p className="text-gray-500 text-sm italic">Chưa có...</p>}
          </div>
        </div>
      </div>

      {/* Phần Điều khiển (Bên phải) */}
      <div className="w-80 flex-shrink-0 ml-6 flex flex-col items-center">
        <div>
          {(phase === 'movement' || phase === 'building') && (
            <h2 className="text-xl text-center">Lượt của: <span className="font-bold text-blue-400">{currentTurnPlayerName}</span></h2>
          )}
           {phase === 'trading' && (
            <h2 className="text-xl text-center font-bold text-purple-300">Giai đoạn Đàm phán</h2>
          )}
          {error && <p className="text-red-500 text-sm mt-1 text-center h-5">{error}</p>}
        </div>
        <div className="w-full mt-2 grid grid-cols-2 gap-2">
          <button onClick={onRollDice} disabled={!isMyTurn || phase !== 'movement'} className="col-span-1 px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all">
            <Dices />
            {isMyTurn && phase === 'movement' ? "Tung" : "Đợi Lượt"}
          </button>
          <button onClick={onOpenTrade} disabled={phase !== 'trading'} className="col-span-1 px-4 py-3 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all">
            <Handshake />
            Giao dịch
          </button>
          <button onClick={onEndBuildingTurn} disabled={!isMyTurn || phase !== 'building'} className="col-span-2 px-4 py-3 font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-2">
            <Hammer />
            {isMyTurn && phase === 'building' ? "Kết thúc lượt xây" : "Đợi lượt xây"}
          </button>
        </div>
      </div>
    </div>
  );
}