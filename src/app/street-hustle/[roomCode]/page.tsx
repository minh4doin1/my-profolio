// src/app/street-hustle/[roomCode]/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase, getAnonymousUserId } from '@/lib/supabase';
import { User, Crown } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';

// --- IMPORT STORE VÀ CÁC COMPONENT ---
import { useGameStore } from '@/store/useGameStore';
import GameBoard from './GameBoard';
import DiceResult from './DiceResult';
import ActionToast from './ActionToast';
import GameUI from './GameUI';
import GamePhaseHeader from './GamePhaseHeader';
import OffersDashboard from './OffersDashboard';
import TradingModal from './TradingModal';

// --- TYPE DEFINITIONS (Giữ lại các type cần thiết cho component) ---
type LastDiceRoll = { playerName: string; dice1: number; dice2: number; specialDie: number; } | null;

export default function GamePage() {
  const params = useParams();
  const roomCode = params?.roomCode as string;
  
  // --- LẤY STATE VÀ ACTIONS TỪ ZUSTAND STORE ---
  const { 
    status, phase, roundNumber, phaseEndsAt, error,
    players, currentTurnPlayerId, myAssets, offers,
    initialize, processBroadcastPayload, setMyAssets, setError: setStoreError
  } = useGameStore();

  // --- STATE CỤC BỘ CỦA COMPONENT (UI-only state) ---
  const [lastDiceRoll, setLastDiceRoll] = useState<LastDiceRoll>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [currentUserId] = useState(getAnonymousUserId());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentPlayer = players.find(p => p.user_id === currentUserId);

  // --- XỬ LÝ BROADCAST ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGameUpdate = useCallback((payload: any) => {
    // Xử lý các hiệu ứng UI tạm thời
    if (payload.type === 'PLAYER_MOVED') {
      setLastDiceRoll({ playerName: payload.playerName, dice1: payload.dice1, dice2: payload.dice2, specialDie: payload.specialDie });
      setTimeout(() => setLastDiceRoll(null), 4000);

      if (payload.tileAction) {
        let actionMessage = '';
        if (payload.tileAction.type === 'drawn_land') actionMessage = `${payload.playerName} rút được Sổ Đỏ [${String.fromCharCode(65 + payload.tileAction.data.x)}${payload.tileAction.data.y + 1}]!`;
        else if (payload.tileAction.type === 'drawn_business') actionMessage = `${payload.playerName} rút được 2 Mảnh Ghép Kinh Doanh!`;
        setLastAction(actionMessage);
        setTimeout(() => setLastAction(null), 4000);
        
        // Nếu là mình, fetch lại tài sản
        if (payload.playerId === currentPlayer?.id) {
          supabase.functions.invoke('get-player-assets', { body: { roomCode, userId: currentUserId } })
            .then(({ data, error }) => {
              if (error || data.error) console.error("Failed to refetch assets:", error || data.error);
              else if (data) setMyAssets(data);
            });
        }
      }
    }
    // Gửi payload vào store để xử lý logic state chính
    processBroadcastPayload(payload, currentPlayer?.id);
  }, [processBroadcastPayload, currentPlayer?.id, roomCode, currentUserId, setMyAssets]);

  // --- KHỞI TẠO VÀ LẮNG NGHE KÊNH REALTIME ---
  useEffect(() => {
    setIsMounted(true);
    if (!roomCode) return;

    const setupAndSubscribe = async () => {
      try {
        const [roomStateRes, assetStateRes, roomDataRes] = await Promise.all([
          supabase.functions.invoke('get-room-state', { body: { roomCode } }),
          supabase.functions.invoke('get-player-assets', { body: { roomCode, userId: currentUserId } }),
          supabase.from('rooms').select('id, status, current_turn_player_id, round_number, current_phase, phase_ends_at').eq('room_code', roomCode.toUpperCase()).single()
        ]);

        if (roomStateRes.error || roomStateRes.data.error) throw new Error(roomStateRes.error?.message || roomStateRes.data.error);
        if (assetStateRes.error || assetStateRes.data.error) throw new Error(assetStateRes.error?.message || assetStateRes.data.error);
        if (roomDataRes.error) throw roomDataRes.error;
        if (!roomDataRes.data) throw new Error("Room data not found.");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const playersWithColors = roomStateRes.data.players.map((p: any, i: number) => ({ ...p, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }));
        
        // Khởi tạo store với dữ liệu ban đầu
        initialize({
          status: roomDataRes.data.status,
          players: playersWithColors,
          phase: roomDataRes.data.current_phase,
          roundNumber: roomDataRes.data.round_number,
          phaseEndsAt: roomDataRes.data.phase_ends_at,
          currentTurnPlayerId: roomDataRes.data.current_turn_player_id,
        });
        setMyAssets(assetStateRes.data);

        const roomId = roomDataRes.data.id;
        const channel = supabase.channel(`room-${roomId}`);
        channel
          .on('broadcast', { event: 'game_update' }, (message) => handleGameUpdate(message.payload))
          .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') console.log(`✅ Successfully subscribed to channel: room-${roomId}`);
            if (err) console.error("Subscription error:", err);
          });
        
        channelRef.current = channel;

      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        setStoreError(errorMessage);
      }
    };

    setupAndSubscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomCode, currentUserId, initialize, setMyAssets, setStoreError, handleGameUpdate]);

  // --- CÁC HÀM XỬ LÝ HÀNH ĐỘNG CỦA NGƯỜI DÙNG ---
  const handleStartGame = async () => {
    try {
      const { error } = await supabase.functions.invoke('start-game', { body: { roomCode, userId: currentUserId } });
      if (error) throw new Error(error.message);
    } catch (e: unknown) {
      setStoreError(e instanceof Error ? e.message : "Failed to start game.");
    }
  };

  const handleRollDice = async () => {
    try {
      setStoreError('');
      await supabase.functions.invoke('roll-dice', { body: { roomCode, userId: currentUserId } });
    } catch (e: unknown) {
      setStoreError(e instanceof Error ? e.message : "Failed to roll dice.");
    }
  };
  const handleEndBuildingTurn = async () => {
    try {
      setStoreError(''); // Xóa lỗi cũ nếu có
      await supabase.functions.invoke('end-building-turn', { 
        body: { roomCode, userId: currentUserId } 
      });
    } catch (e: unknown) {
      setStoreError(e instanceof Error ? e.message : "Failed to end building turn.");
    }
  };
  const isMyTurn = currentPlayer?.id === currentTurnPlayerId;

  // --- RENDER LOGIC ---
  if (!isMounted || status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading Game...</div>;
  }

  if (status === 'error') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  if (status === 'ingame') {
    return (
      <div className="w-full h-full flex flex-col bg-gray-800">
        <GamePhaseHeader 
          phase={phase} 
          roundNumber={roundNumber} 
          phaseEndsAt={phaseEndsAt} 
          roomCode={roomCode}
        />
        <GameBoard players={players} />
        <AnimatePresence>
          {lastDiceRoll && <DiceResult key="dice-result" playerName={lastDiceRoll.playerName} dice1={lastDiceRoll.dice1} dice2={lastDiceRoll.dice2} specialDie={lastDiceRoll.specialDie} />}
          {lastAction && <ActionToast key="action-toast" message={lastAction} />}
          <TradingModal
            key="trading-modal"
            isOpen={isTrading}
            onClose={() => setIsTrading(false)}
            players={players}
            myPlayerId={currentPlayer?.id || ''}
            myLands={myAssets.lands}
            myBusinessTiles={myAssets.businessTiles}
            roomCode={roomCode}
            currentUserId={currentUserId}
          />
          {phase === 'trading' && (
            <OffersDashboard
              key="offers-dashboard"
              offers={offers}
              myPlayerId={currentPlayer?.id || ''}
              currentUserId={currentUserId}
              roomCode={roomCode}
            />
          )}
        </AnimatePresence>
        <GameUI
          myLands={myAssets.lands}
          myBusinessTiles={myAssets.businessTiles}
          isMyTurn={isMyTurn}
          onRollDice={handleRollDice}
          currentTurnPlayerName={players.find(p => p.id === currentTurnPlayerId)?.nickname || '...'}
          error={error || ''}
          phase={phase}
          onOpenTrade={() => setIsTrading(true)}
          myPlayerGold={currentPlayer?.gold || 0}
          onEndBuildingTurn={handleEndBuildingTurn}
        />
      </div>
    );
  }
  
  // Giao diện Lobby
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
        {currentPlayer?.is_host && (
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

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];