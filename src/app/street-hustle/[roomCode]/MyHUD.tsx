// src/app/street-hustle/[roomCode]/MyHUD.tsx
"use client";

import { MapPin, Building2 } from 'lucide-react';
import { Land, BusinessTile } from '@/store/useGameStore';

// SỬA LỖI: Xóa hook useGameStore

interface MyHUDProps {
  myAssets: {
    lands: Land[];
    businessTiles: BusinessTile[];
  };
  isMyTurn: boolean;
  phase: 'lobby' | 'movement' | 'trading' | 'building' | 'income';
  onSelectTile: (tileId: string) => void;
  selectedTileId: string | null;
}

export default function MyHUD({ myAssets, isMyTurn, phase, onSelectTile, selectedTileId }: MyHUDProps) {
  // SỬA LỖI: Tất cả dữ liệu giờ đến từ props
  const canBuild = isMyTurn && phase === 'building';

  return (
    <div className="flex-grow flex flex-col gap-4 overflow-hidden">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">Tài sản của bạn</h2>
      
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><MapPin className="text-green-400" />Sổ Đỏ ({myAssets.lands.length})</h3>
        <div className="flex flex-wrap gap-2 p-2 bg-black/20 rounded max-h-48 overflow-y-auto">
          {myAssets.lands.length > 0 ? myAssets.lands.map((land: Land) => (
            <span key={land.id} className="bg-green-800 text-green-200 px-2 py-1 rounded text-sm font-mono">
              {String.fromCharCode(65 + land.x_coord)}{land.y_coord + 1}
            </span>
          )) : <p className="text-gray-500 text-sm italic">Chưa có...</p>}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Building2 className="text-purple-400" />Kinh Doanh ({myAssets.businessTiles.length})</h3>
        <div className="flex flex-wrap gap-2 p-2 bg-black/20 rounded max-h-48 overflow-y-auto">
          {myAssets.businessTiles.length > 0 ? myAssets.businessTiles.map((tile: BusinessTile) => (
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
  );
}