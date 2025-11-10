// src/app/street-hustle/[roomCode]/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase, getAnonymousUserId } from '@/lib/supabase';
import { User, Crown, Dices } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';
import GameBoard from './GameBoard';
import DiceResult from './DiceResult';
import ActionToast from './ActionToast';
import GameUI from './GameUI';

// Type definitions... (giữ nguyên)
type Player = { id: string; user_id: string; nickname: string; is_host: boolean; position_on_path: number; color: string; };
type Land = { id: string; x_coord: number; y_coord: number; };
type BusinessTile = { id: string; tile_type: string; };
type GameStatus = 'loading' | 'lobby' | 'ingame' | 'error';
type LastDiceRoll = { playerName: string; dice1: number; dice2: number; specialDie: number; } | null;

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];

export default function GamePage() {
  const params = useParams();
  const roomCode = params?.roomCode as string;
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('loading');
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(null);
  const [myLands, setMyLands] = useState<Land[]>([]);
  const [myBusinessTiles, setMyBusinessTiles] = useState<BusinessTile[]>([]);
  const [error, setError] = useState('');
  const [lastDiceRoll, setLastDiceRoll] = useState<LastDiceRoll>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [currentUserId] = useState(getAnonymousUserId());
  const channelRef = useRef<RealtimeChannel | null>(null);

  // SỬA LỖI LỚN: Tái cấu trúc useEffect để đảm bảo real-time hoạt động
  useEffect(() => {
    if (!roomCode) return;

    const setupAndSubscribe = async () => {
      try {
        // 1. Fetch tất cả state ban đầu CÙNG LÚC để tăng tốc
        const [roomStateRes, assetStateRes, roomDataRes] = await Promise.all([
          supabase.functions.invoke('get-room-state', { body: { roomCode } }),
          supabase.functions.invoke('get-player-assets', { body: { roomCode, userId: currentUserId } }),
          supabase.from('rooms').select('id, status, current_turn_player_id').eq('room_code', roomCode.toUpperCase()).single()
        ]);

        // Xử lý lỗi tập trung
        if (roomStateRes.error || roomStateRes.data.error) throw new Error(roomStateRes.error?.message || roomStateRes.data.error);
        if (assetStateRes.error || assetStateRes.data.error) throw new Error(assetStateRes.error?.message || assetStateRes.data.error);
        if (roomDataRes.error) throw roomDataRes.error;
        if (!roomDataRes.data) throw new Error("Room data not found.");

        // Cập nhật state
        const playersWithColors = roomStateRes.data.players.map((p: Omit<Player, 'color'>, i: number) => ({ ...p, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }));
        setPlayers(playersWithColors);
        setMyLands(assetStateRes.data.lands || []);
        setMyBusinessTiles(assetStateRes.data.businessTiles || []);
        setGameStatus(roomDataRes.data.status as GameStatus);
        setCurrentTurnPlayerId(roomDataRes.data.current_turn_player_id);

        // 2. SAU KHI có roomId, MỚI tạo và subscribe kênh
        const roomId = roomDataRes.data.id;
        const channel = supabase.channel(`room-${roomId}`);
        
        channel
          .on('broadcast', { event: 'player_joined' }, (message) => {
            const newPlayer = message.payload.newPlayer as Omit<Player, 'color'>;
            setPlayers(currentPlayers => {
              if (currentPlayers.some(p => p.id === newPlayer.id)) return currentPlayers;
              const newPlayerWithColor = { ...newPlayer, color: PLAYER_COLORS[currentPlayers.length % PLAYER_COLORS.length] };
              return [...currentPlayers, newPlayerWithColor];
            });
          })
          .on('broadcast', { event: 'game_started' }, (message) => {
            setGameStatus('ingame');
            setCurrentTurnPlayerId(message.payload.startingPlayerId);
          })
          .on('broadcast', { event: 'player_moved' }, (message) => {
            const { playerId, playerName, dice1, dice2, specialDie, newPosition, nextTurnPlayerId, tileAction } = message.payload;
            setLastDiceRoll({ playerName, dice1, dice2, specialDie });
            setTimeout(() => setLastDiceRoll(null), 4000);
            setPlayers(current => current.map(p => p.id === playerId ? { ...p, position_on_path: newPosition } : p));
            setCurrentTurnPlayerId(nextTurnPlayerId);
            if (tileAction) {
              let actionMessage = '';
              if (tileAction.type === 'drawn_land') actionMessage = `${playerName} rút được Sổ Đỏ [${String.fromCharCode(65 + tileAction.data.x)}${tileAction.data.y + 1}]!`;
              else if (tileAction.type === 'drawn_business') actionMessage = `${playerName} rút được 2 Mảnh Ghép Kinh Doanh!`;
              setLastAction(actionMessage);
              setTimeout(() => setLastAction(null), 4000);
              if (playerId === players.find(p => p.user_id === currentUserId)?.id) {
                supabase.functions.invoke('get-player-assets', { body: { roomCode, userId: currentUserId } })
                  .then(({ data, error }) => {
                    if (error || data.error) console.error("Failed to refetch assets:", error || data.error);
                    else if (data) {
                      setMyLands(data.lands || []);
                      setMyBusinessTiles(data.businessTiles || []);
                    }
                  });
              }
            }
          })
          .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
              console.log(`✅ Successfully subscribed to channel: room-${roomId}`);
            }
            if (err) {
              console.error("Subscription error:", err);
            }
          });
        
        channelRef.current = channel;

      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message);
        else setError("An unexpected error occurred.");
        setGameStatus('error');
      }
    };

    setupAndSubscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomCode, currentUserId]); // Dependency array đã được sửa lại, không còn `players`

  const handleStartGame = async () => {
    try {
      const { error } = await supabase.functions.invoke('start-game', {
        body: { roomCode, userId: currentUserId },
      });
      if (error) throw new Error(error.message);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred while starting the game.");
      }
    }
  };

  const handleRollDice = async () => {
    try {
      setError(''); // Xóa lỗi cũ trước khi tung
      await supabase.functions.invoke('roll-dice', {
        body: { roomCode, userId: currentUserId },
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred while rolling the dice.");
      }
    }
  };

  const currentPlayer = players.find(p => p.user_id === currentUserId);
  const isMyTurn = currentPlayer?.id === currentTurnPlayerId;

  if (gameStatus === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading Game...</div>;
  }

  if (gameStatus === 'error') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  if (gameStatus === 'ingame') {
    return (
      <div className="w-full h-full flex flex-col bg-gray-800">
        <GameBoard players={players} />
        <AnimatePresence>
          {lastDiceRoll && <DiceResult playerName={lastDiceRoll.playerName} dice1={lastDiceRoll.dice1} dice2={lastDiceRoll.dice2} specialDie={lastDiceRoll.specialDie} />}
          {lastAction && <ActionToast message={lastAction} />}
        </AnimatePresence>
        <GameUI
          myLands={myLands}
          myBusinessTiles={myBusinessTiles}
          isMyTurn={isMyTurn}
          onRollDice={handleRollDice}
          currentTurnPlayerName={players.find(p => p.id === currentTurnPlayerId)?.nickname || '...'}
          error={error}
        />
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