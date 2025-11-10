// src/app/street-hustle/[roomCode]/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase, getAnonymousUserId } from '@/lib/supabase';
import { User, Crown, Dices } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import GameBoard from './GameBoard';

type Player = {
  id: string;
  user_id: string;
  nickname: string;
  is_host: boolean;
  position_on_path: number;
  color: string;
};

type GameStatus = 'loading' | 'lobby' | 'ingame' | 'error';

// Định nghĩa kiểu dữ liệu cho các payload broadcast
type PlayerJoinedPayload = {
  newPlayer: Player;
};
type GameStartedPayload = {
  startingPlayerId: string;
};
type PlayerMovedPayload = {
  playerId: string;
  diceRoll: number;
  newPosition: number;
  nextTurnPlayerId: string;
};

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];

export default function GamePage() {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('loading');
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [currentUserId] = useState(getAnonymousUserId());
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    const setupLobby = async () => {
      try {
        const { data: roomState, error: funcError } = await supabase.functions.invoke('get-room-state', {
          body: { roomCode },
        });
        if (funcError) throw new Error(funcError.message);
        if (roomState.error) throw new Error(roomState.error);
        
        const playersWithColors = roomState.players.map((p: Omit<Player, 'color'>, index: number) => ({
          ...p,
          color: PLAYER_COLORS[index % PLAYER_COLORS.length],
        }));
        setPlayers(playersWithColors);

        const { data: roomData } = await supabase.from('rooms').select('id, status, current_turn_player_id').eq('room_code', roomCode.toUpperCase()).single();
        if (!roomData) throw new Error("Room data not found for subscription.");
        
        setGameStatus(roomData.status as GameStatus);
        setCurrentTurnPlayerId(roomData.current_turn_player_id);

        const channel = supabase.channel(`room-${roomData.id}`);
        
        // SỬA LỖI TYPESCRIPT: Cú pháp đúng để lắng nghe broadcast
        channel
          .on('broadcast', { event: 'player_joined' }, (message) => {
            const payload = message.payload as PlayerJoinedPayload;
            const newPlayer = payload.newPlayer;
            setPlayers(currentPlayers => {
              if (currentPlayers.some(p => p.id === newPlayer.id)) return currentPlayers;
              const newPlayerWithColor = {
                ...newPlayer,
                color: PLAYER_COLORS[currentPlayers.length % PLAYER_COLORS.length],
              };
              return [...currentPlayers, newPlayerWithColor];
            });
          })
          .on('broadcast', { event: 'game_started' }, (message) => {
            const payload = message.payload as GameStartedPayload;
            setGameStatus('ingame');
            setCurrentTurnPlayerId(payload.startingPlayerId);
          })
          .on('broadcast', { event: 'player_moved' }, (message) => {
            const payload = message.payload as PlayerMovedPayload;
            const { playerId, newPosition, nextTurnPlayerId } = payload;
            setPlayers(currentPlayers => currentPlayers.map(p => 
              p.id === playerId ? { ...p, position_on_path: newPosition } : p
            ));
            setCurrentTurnPlayerId(nextTurnPlayerId);
          })
          .subscribe();
        channelRef.current = channel;

      } catch (e: unknown) { // SỬA LỖI ESLINT: Dùng 'unknown'
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred.");
        }
        setGameStatus('error');
      }
    };

    setupLobby();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomCode]);

  const handleStartGame = async () => {
    try {
      const { error } = await supabase.functions.invoke('start-game', {
        body: { roomCode, userId: currentUserId },
      });
      if (error) throw new Error(error.message);
    } catch (e: unknown) { // SỬA LỖI ESLINT: Dùng 'unknown'
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleRollDice = async () => {
    try {
      await supabase.functions.invoke('roll-dice', {
        body: { roomCode, userId: currentUserId },
      });
    } catch (e: unknown) { // SỬA LỖI ESLINT: Dùng 'unknown'
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const currentPlayer = players.find(p => p.user_id === currentUserId);
  const isMyTurn = currentPlayer?.id === currentTurnPlayerId;

  if (gameStatus === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (gameStatus === 'error') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  if (gameStatus === 'ingame') {
    return (
      <div className="w-screen h-screen flex flex-col">
        <GameBoard players={players} />
        <div className="w-full bg-gray-900 p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl">Lượt của: {players.find(p => p.id === currentTurnPlayerId)?.nickname || '...'}</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <button
            onClick={handleRollDice}
            disabled={!isMyTurn}
            className="px-6 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Dices />
            {isMyTurn ? "Tung Xúc xắc" : "Đợi Lượt"}
          </button>
        </div>
      </div>
    );
  }

  const isCurrentUserHost = currentPlayer ? currentPlayer.is_host : false;
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
        {isCurrentUserHost && (
          <button
            onClick={handleStartGame}
            className="w-full py-3 mt-4 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500"
          >
            Start Game
          </button>
        )}
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>
    </div>
  );
}