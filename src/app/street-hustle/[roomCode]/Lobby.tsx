"use client";

import { User, Crown } from 'lucide-react';
import { Player } from '@/store/useGameStore';

interface LobbyProps {
  roomCode: string;
  players: Player[];
  isHost: boolean;
  onStartGame: () => void;
  error: string | null;
}

export default function Lobby({ roomCode, players, isHost, onStartGame, error }: LobbyProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Room Code: <span className="text-blue-400 tracking-widest">{roomCode.toUpperCase()}</span></h1>
          <p className="mt-2 text-gray-400">Share this code with your friends to join!</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Players ({players.length}/8)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {players.map((player) => (
              <div key={player.id} className="flex items-center p-3 bg-gray-700 rounded-md">
                {player.is_host ? <Crown className="w-6 h-6 mr-3 text-yellow-400" /> : <User className="w-6 h-6 mr-3 text-gray-400" />}
                <span className="font-medium">{player.nickname}</span>
              </div>
            ))}
          </div>
        </div>
        {isHost && (
          <button
            onClick={onStartGame}
            disabled={players.length < 2}
            className="w-full py-3 mt-4 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {players.length < 2 ? `Cần thêm ${2 - players.length} người chơi` : "Start Game"}
          </button>
        )}
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>
    </div>
  );
}