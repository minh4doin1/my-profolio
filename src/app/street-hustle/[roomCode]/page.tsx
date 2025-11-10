//src/app/street-hustle/[roomCode]/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase, getAnonymousUserId } from '@/lib/supabase';
import { User, Crown } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';
import GameBoard from './GameBoard';
import DiceResult from './DiceResult';
import ActionToast from './ActionToast';
import GameUI from './GameUI';
import GamePhaseHeader from './GamePhaseHeader';
import TradingModal from './TradingModal';

// Type Definitions
type GamePhase = 'lobby' | 'movement' | 'trading' | 'building' | 'income';
type GameState = {
  status: 'loading' | 'lobby' | 'ingame' | 'error';
  phase: GamePhase;
  roundNumber: number;
  phaseEndsAt: string | null;
}
type Player = { id: string; user_id: string; nickname: string; is_host: boolean; position_on_path: number; color: string; };
type Land = { id: string; x_coord: number; y_coord: number; };
type BusinessTile = { id: string; tile_type: string; };
type LastDiceRoll = { playerName: string; dice1: number; dice2: number; specialDie: number; } | null;

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];

export default function GamePage() {
  const params = useParams();
  const roomCode = params?.roomCode as string;

  // State Management
  const [gameState, setGameState] = useState<GameState>({
    status: 'loading',
    phase: 'lobby',
    roundNumber: 0,
    phaseEndsAt: null,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(null);
  const [myLands, setMyLands] = useState<Land[]>([]);
  const [myBusinessTiles, setMyBusinessTiles] = useState<BusinessTile[]>([]);
  const [error, setError] = useState('');
  const [lastDiceRoll, setLastDiceRoll] = useState<LastDiceRoll>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [currentUserId] = useState(getAnonymousUserId());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isMounted, setIsMounted] = useState(false);

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

        const playersWithColors = roomStateRes.data.players.map((p: Omit<Player, 'color'>, i: number) => ({ ...p, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }));
        setPlayers(playersWithColors);
        setMyLands(assetStateRes.data.lands || []);
        setMyBusinessTiles(assetStateRes.data.businessTiles || []);
        
        setGameState({
          status: roomDataRes.data.status as GameState['status'],
          phase: roomDataRes.data.current_phase as GamePhase,
          roundNumber: roomDataRes.data.round_number,
          phaseEndsAt: roomDataRes.data.phase_ends_at,
        });
        setCurrentTurnPlayerId(roomDataRes.data.current_turn_player_id);

        const roomId = roomDataRes.data.id;
        const channel = supabase.channel(`room-${roomId}`);
        
        channel
          .on('broadcast', { event: 'game_update' }, (message) => {
            const { type, ...data } = message.payload;
            console.log('Received game_update:', type, data);

            switch (type) {
              case 'PLAYER_JOINED': {
                const newPlayer = data.newPlayer as Omit<Player, 'color'>;
                setPlayers(currentPlayers => {
                  if (currentPlayers.some(p => p.id === newPlayer.id)) return currentPlayers;
                  const newPlayerWithColor = { ...newPlayer, color: PLAYER_COLORS[currentPlayers.length % PLAYER_COLORS.length] };
                  return [...currentPlayers, newPlayerWithColor];
                });
                break;
              }
              case 'GAME_STARTED': {
                setGameState(gs => ({ ...gs, status: 'ingame', phase: 'movement', roundNumber: 1 }));
                setCurrentTurnPlayerId(data.startingPlayerId);
                break;
              }
              case 'PLAYER_MOVED': {
                setLastDiceRoll({ playerName: data.playerName, dice1: data.dice1, dice2: data.dice2, specialDie: data.specialDie });
                setTimeout(() => setLastDiceRoll(null), 4000);
                setPlayers(current => current.map(p => p.id === data.playerId ? { ...p, position_on_path: data.newPosition } : p));
                setCurrentTurnPlayerId(data.nextTurnPlayerId);
                
                if (data.tileAction) {
                  let actionMessage = '';
                  if (data.tileAction.type === 'drawn_land') actionMessage = `${data.playerName} rút được Sổ Đỏ [${String.fromCharCode(65 + data.tileAction.data.x)}${data.tileAction.data.y + 1}]!`;
                  else if (data.tileAction.type === 'drawn_business') actionMessage = `${data.playerName} rút được 2 Mảnh Ghép Kinh Doanh!`;
                  setLastAction(actionMessage);
                  setTimeout(() => setLastAction(null), 4000);
                  if (data.playerId === players.find(p => p.user_id === currentUserId)?.id) {
                    supabase.functions.invoke('get-player-assets', { body: { roomCode, userId: currentUserId } })
                      .then(({ data: assetData, error: assetError }) => {
                        if (assetError || assetData.error) console.error("Failed to refetch assets:", assetError || assetData.error);
                        else if (assetData) {
                          setMyLands(assetData.lands || []);
                          setMyBusinessTiles(assetData.businessTiles || []);
                        }
                      });
                  }
                }
                break;
              }
              case 'PHASE_CHANGED': {
                setGameState(gs => ({
                  ...gs,
                  phase: data.newPhase,
                  roundNumber: data.roundNumber,
                  phaseEndsAt: data.phaseEndsAt,
                }));
                setCurrentTurnPlayerId(null);
                break;
              }
            }
          })
          .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') console.log(`✅ Successfully subscribed to channel: room-${roomId}`);
            if (err) console.error("Subscription error:", err);
          });
        
        channelRef.current = channel;

      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message);
        else setError("An unexpected error occurred.");
        setGameState(gs => ({ ...gs, status: 'error' }));
      }
    };

    setupAndSubscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomCode, currentUserId]);

  const handleStartGame = async () => {
    try {
      const { error } = await supabase.functions.invoke('start-game', {
        body: { roomCode, userId: currentUserId },
      });
      if (error) throw new Error(error.message);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("An unexpected error occurred while starting the game.");
    }
  };

  const handleRollDice = async () => {
    try {
      setError('');
      await supabase.functions.invoke('roll-dice', {
        body: { roomCode, userId: currentUserId },
      });
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("An unexpected error occurred while rolling the dice.");
    }
  };

  const currentPlayer = players.find(p => p.user_id === currentUserId);
  const isMyTurn = currentPlayer?.id === currentTurnPlayerId;

  if (!isMounted || gameState.status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading Game...</div>;
  }

  if (gameState.status === 'error') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  if (gameState.status === 'ingame') {
    return (
      <div className="w-full h-full flex flex-col bg-gray-800">
        <GamePhaseHeader 
          phase={gameState.phase} 
          roundNumber={gameState.roundNumber} 
          phaseEndsAt={gameState.phaseEndsAt} 
          roomCode={roomCode}
        />
        <GameBoard players={players} />
        <AnimatePresence>
          {lastDiceRoll && <DiceResult  key="dice-result" playerName={lastDiceRoll.playerName} dice1={lastDiceRoll.dice1} dice2={lastDiceRoll.dice2} specialDie={lastDiceRoll.specialDie} />}
          {lastAction && <ActionToast key="action-toast" message={lastAction} />}
          <TradingModal
            isOpen={isTrading}
            onClose={() => setIsTrading(false)}
            players={players}
            myPlayerId={currentPlayer?.id || ''}
            myLands={myLands}
            myBusinessTiles={myBusinessTiles}
            roomCode={roomCode}
            currentUserId={currentUserId}
          />
        </AnimatePresence>
        <GameUI
          myLands={myLands}
          myBusinessTiles={myBusinessTiles}
          isMyTurn={isMyTurn}
          onRollDice={handleRollDice}
          currentTurnPlayerName={players.find(p => p.id === currentTurnPlayerId)?.nickname || '...'}
          error={error}
          phase={gameState.phase}
          onOpenTrade={() => setIsTrading(true)}
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