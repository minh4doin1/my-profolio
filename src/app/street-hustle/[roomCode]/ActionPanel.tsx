// src/app/street-hustle/[roomCode]/ActionPanel.tsx
"use client";

import { Dices, Handshake, Hammer } from 'lucide-react';

// SỬA LỖI: Xóa hook useGameStore

interface ActionPanelProps {
  isMyTurn: boolean;
  phase: 'lobby' | 'movement' | 'trading' | 'building' | 'income';
  currentTurnPlayerName: string;
  error: string | null;
  onRollDice: () => void;
  onEndBuildingTurn: () => void;
  onOpenTrade: () => void;
}

export default function ActionPanel({ 
  isMyTurn, 
  phase,
  currentTurnPlayerName,
  error,
  onRollDice, 
  onEndBuildingTurn, 
  onOpenTrade 
}: ActionPanelProps) {
  // SỬA LỖI: Tất cả dữ liệu giờ đến từ props

  return (
    <div className="w-full mt-auto pt-4 border-t border-gray-700">
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
  );
}