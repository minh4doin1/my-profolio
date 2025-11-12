// src/app/street-hustle/[roomCode]/PlayerList.tsx
"use client";

import { Crown, User, Coins } from 'lucide-react';
import { Player } from '@/store/useGameStore';
import { motion } from 'framer-motion';

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
            className={`p-3 rounded-lg transition-all duration-300 border-2 ${
              player.id === currentTurnPlayerId 
              ? 'bg-blue-500/30 border-blue-400 shadow-lg' 
              : 'bg-gray-800 border-transparent'
            }`}
          >
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
            <div className="mt-2 flex items-center gap-2 text-yellow-400">
              <Coins size={16} />
              <span className="font-bold text-xl">{player.gold.toLocaleString('en-US')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}