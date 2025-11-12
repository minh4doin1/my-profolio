// src/app/street-hustle/[roomCode]/GameBoard.tsx
"use client";

import { boardTiles, BoardTile } from './boardData';
import { Home, HelpCircle, Banknote, ShoppingCart, Siren, LandPlot as LandPlotIcon, Building, Minus } from 'lucide-react';
import { useGameStore, Player, Land } from '@/store/useGameStore';

// --- TYPE DEFINITIONS ---
interface GameBoardProps {
  players: Player[];
  lands: Land[];
  myPlayerId: string | undefined;
  isMyTurn: boolean;
  phase: 'lobby' | 'movement' | 'trading' | 'building' | 'income';
  selectedTileId: string | null;
  onLandClick: (landId: string) => void;
}

// --- COMPONENT CON ---

const RoadGridPlot = () => (
  <div className="bg-gray-700 flex items-center justify-center">
    <Minus className="w-8 h-8 text-gray-500" />
  </div>
);

const LandGridPlot = ({ land, isBuildable, onLandClick }: { land: Land, isBuildable: boolean, onLandClick: (landId: string) => void }) => {
  const player = useGameStore.getState().players.find(p => p.id === land.owner_player_id);
  const playerColor = player?.color;
  const baseClasses = "border border-black/20 flex items-center justify-center transition-all duration-200 relative";
  const buildableClasses = isBuildable ? 'cursor-pointer ring-4 ring-yellow-400 ring-inset z-10 hover:bg-opacity-50' : '';
  return (
    <div 
      className={`${baseClasses} ${buildableClasses}`}
      style={{ backgroundColor: playerColor ? `${playerColor}4D` : 'rgba(107, 114, 128, 0.3)' }} // Thêm alpha channel
      onClick={() => isBuildable && onLandClick(land.id)}
      title={player ? `Sở hữu của: ${player.nickname}` : 'Đất chưa có chủ'}
    >
      {land.business_tile_id && (
        <div title={land.business_tile?.tile_type.replace('_', ' ')}>
          <Building className="w-6 h-6 text-white" />
        </div>
      )}
      <span className="absolute top-0 left-1 text-xs font-bold text-white/50">{String.fromCharCode(65 + land.x_coord)}{land.y_coord + 1}</span>
    </div>
  );
};

const PathTile = ({ tile, style }: { tile: BoardTile, style: React.CSSProperties }) => {
  const tileTypes = {
    start: { color: 'bg-green-500', icon: <Home /> },
    property: { color: 'bg-gray-500', icon: <LandPlotIcon /> },
    chance: { color: 'bg-blue-500', icon: <HelpCircle /> },
    police: { color: 'bg-red-500', icon: <Siren /> },
    market: { color: 'bg-yellow-500', icon: <ShoppingCart /> },
    bank: { color: 'bg-indigo-500', icon: <Banknote /> },
  };
  const { color, icon } = tileTypes[tile.type];

  return (
    <div style={style} className="border border-black bg-gray-200 flex flex-col overflow-hidden">
      <div className={`w-full h-1/3 flex-shrink-0 ${color} flex items-center justify-center text-white`}>{icon}</div>
      <div className="flex-grow flex items-center justify-center p-1">
        <span className="text-center text-[10px] font-bold text-gray-800 leading-tight">{tile.name}</span>
      </div>
    </div>
  );
};

const PlayerPiece = ({ player, index }: { player: Player, index: number }) => {
  const tile = boardTiles[player.position_on_path];
  if (!tile) return null; // An toàn nếu vị trí không hợp lệ

  const styles: React.CSSProperties = {
    backgroundColor: player.color,
    transition: 'all 0.7s cubic-bezier(0.45, 0, 0.55, 1)',
    transform: `translate(${index * 5}px, ${index * 5}px)`,
    zIndex: 20 + index,
  };

  const TILE_SIZE_PERCENT = 100 / 12; // ~8.33%
  const PIECE_SIZE_PERCENT = 4;
  const offset = (TILE_SIZE_PERCENT - PIECE_SIZE_PERCENT) / 2;

  if (tile.position === 'bottom') {
    styles.bottom = `${offset}%`;
    styles.left = `${(11 - tile.id) * TILE_SIZE_PERCENT + offset}%`;
  } else if (tile.position === 'left') {
    styles.left = `${offset}%`;
    styles.bottom = `${(tile.id - 11) * TILE_SIZE_PERCENT + offset}%`;
  } else if (tile.position === 'top') {
    styles.top = `${offset}%`;
    styles.left = `${(tile.id - 22) * TILE_SIZE_PERCENT + offset}%`;
  } else if (tile.position === 'right') {
    styles.right = `${offset}%`;
    styles.top = `${(tile.id - 33) * TILE_SIZE_PERCENT + offset}%`;
  }

  return (
    <div className="absolute w-[4%] h-[4%] rounded-full border-2 border-white shadow-lg" style={styles} title={player.nickname}></div>
  );
};

// --- COMPONENT CHÍNH ---
export default function GameBoard({ players, lands, myPlayerId, isMyTurn, phase, selectedTileId, onLandClick }: GameBoardProps) {
  return (
    <div className="w-full flex-grow flex items-center justify-center bg-gray-800 p-4 relative">
      <div className="aspect-square w-full max-w-6xl relative">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
          {/* Vòng Ngoài */}
          {boardTiles.map(tile => {
            const gridStyle: React.CSSProperties = {};
            if (tile.position === 'bottom') { gridStyle.gridRowStart = 12; gridStyle.gridColumnStart = 12 - tile.id; } 
            else if (tile.position === 'left') { gridStyle.gridRowStart = 12 - (tile.id - 11); gridStyle.gridColumnStart = 1; } 
            else if (tile.position === 'top') { gridStyle.gridRowStart = 1; gridStyle.gridColumnStart = 1 + (tile.id - 22); } 
            else if (tile.position === 'right') { gridStyle.gridRowStart = 1 + (tile.id - 33); gridStyle.gridColumnStart = 12; }
            return <PathTile key={tile.id} tile={tile} style={gridStyle} />;
          })}
          
          {/* Vùng Trung Tâm 10x10 */}
          <div className="col-start-2 col-span-10 row-start-2 row-span-10 bg-green-900/50 grid grid-cols-10 grid-rows-10">
            {lands.map(land => {
              if (land.land_type === 'road') {
                return <RoadGridPlot key={land.id} />;
              }
              
              const isOwner = land.owner_player_id === myPlayerId;
              const isBuildable = isOwner && isMyTurn && phase === 'building' && !land.business_tile_id && !!selectedTileId;
              return (
                <LandGridPlot 
                  key={land.id} 
                  land={land}
                  isBuildable={isBuildable}
                  onLandClick={onLandClick}
                />
              );
            })}
          </div>
        </div>
        {/* Quân cờ */}
        {players.map((p, index) => <PlayerPiece key={p.id} player={p} index={index} />)}
      </div>
    </div>
  );
}