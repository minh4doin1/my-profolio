"use client";

import { Crown, Coins, FileText, LayoutGrid } from 'lucide-react';
import { Player, PlayerLand, PlayerBusinessTile } from '@/store/useGameStore';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import React from 'react';

// --- NEW SUB-COMPONENT ---
// A reusable component to display a list of asset badges with a limit.
interface AssetDisplayProps {
  assets: PlayerLand[] | PlayerBusinessTile[];
  limit?: number;
  icon: React.ReactNode;
  assetType: 'land' | 'tile';
  tooltipId: string;
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ assets = [], limit = 4, icon, assetType, tooltipId }) => {
  const displayedAssets = assets.slice(0, limit);
  const remainingCount = assets.length - limit;

  const getAssetName = (asset: PlayerLand | PlayerBusinessTile) => {
    if (assetType === 'land') return (asset as PlayerLand).name;
    return (asset as PlayerBusinessTile).tile_type.replace('_', ' ');
  };

  const fullTooltipContent = assets.length > 0 
    ? assets.map(getAssetName).join(', ') 
    : (assetType === 'land' ? 'Không có Sổ Đỏ' : 'Không có Mảnh Ghép');

  const badgeClass = assetType === 'land' 
    ? "bg-green-800 text-green-200 font-mono" 
    : "bg-purple-800 text-purple-200 capitalize";

  return (
    <div 
      className="mt-2"
      data-tooltip-id={tooltipId}
      data-tooltip-content={fullTooltipContent}
    >
      <div className="flex items-center gap-2 text-gray-400 mb-1.5">
        {icon}
        <h4 className="font-semibold text-sm">{assetType === 'land' ? 'Sổ Đỏ' : 'Kinh Doanh'} ({assets.length})</h4>
      </div>
      <div className="flex flex-wrap gap-1.5 min-h-[26px]">
        {assets.length > 0 ? (
          <>
            {displayedAssets.map(asset => (
              <span key={asset.id} className={`px-2 py-0.5 rounded text-xs ${badgeClass}`}>
                {getAssetName(asset)}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-2 py-0.5 rounded text-xs bg-gray-600 text-gray-200 font-bold">
                +{remainingCount}
              </span>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-xs italic">Chưa có...</p>
        )}
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
interface PlayerListProps {
  players: Player[];
  currentTurnPlayerId: string | null;
}

export default function PlayerList({ players, currentTurnPlayerId }: PlayerListProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Danh sách người chơi</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-3">
        {players.map(player => (
          <div 
            key={player.id} 
            className={`p-3 rounded-lg transition-all duration-300 border-2 flex flex-col ${
              player.id === currentTurnPlayerId 
              ? 'bg-blue-500/30 border-blue-400 shadow-lg' 
              : 'bg-gray-800 border-transparent'
            }`}
          >
            {/* Player Info Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: player.color }}></div>
                <span className="font-semibold text-lg text-white">{player.nickname}</span>
                {player.is_host && <Crown className="w-5 h-5 text-yellow-400" />}
              </div>
              {player.id === currentTurnPlayerId && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-xs font-bold text-blue-300"
                >
                  ĐẾN LƯỢT
                </motion.div>
              )}
            </div>
            
            {/* Divider */}
            <div className="border-b border-gray-700 my-2"></div>

            {/* Assets Section */}
            <div>
              {/* Gold */}
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Coins size={18} />
                <span className="font-bold text-xl">{player.gold.toLocaleString('en-US')}</span>
              </div>

              {/* Detailed Assets */}
              <AssetDisplay 
                assets={player.lands}
                icon={<FileText size={14} />}
                assetType="land"
                tooltipId={`player-lands-${player.id}`}
              />
              <AssetDisplay 
                assets={player.business_tiles_in_hand}
                icon={<LayoutGrid size={14} />}
                assetType="tile"
                tooltipId={`player-tiles-${player.id}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip Components */}
      {players.map(player => (
        <React.Fragment key={player.id}>
          <Tooltip 
            id={`player-lands-${player.id}`} 
            place="top" 
            style={{ backgroundColor: '#1F2937', color: '#D1D5DB', maxWidth: '300px', wordWrap: 'break-word' }}
          />
          <Tooltip 
            id={`player-tiles-${player.id}`} 
            place="top" 
            style={{ backgroundColor: '#1F2937', color: '#D1D5DB', maxWidth: '300px', textTransform: 'capitalize', wordWrap: 'break-word' }}
          />
        </React.Fragment>
      ))}
    </div>
  );
}