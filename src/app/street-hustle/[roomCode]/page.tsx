/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase, getAnonymousUserId } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';

import { useGameStore, Land as LandType, BusinessTile as BusinessTileType } from '@/store/useGameStore';
import GameBoard from './GameBoard';
import DiceResult from './DiceResult';
import ActionToast from './ActionToast';
import PlayerList from './PlayerList';
import MyHUD from './MyHUD';
import ActionPanel from './ActionPanel';
import TradingModal from './TradingModal';
import OffersDashboard from './OffersDashboard';
import GamePhaseHeader from './GamePhaseHeader';
import Lobby from './Lobby'; // Import component Lobby

type LastDiceRoll = { playerName: string; dice1: number; dice2: number; specialDie: number; } | null;

export default function GamePage() {
  const params = useParams();
  const roomCode = params?.roomCode as string;
  
  const { 
    status, phase, roundNumber, phaseEndsAt, error,
    players, currentTurnPlayerId, lands, myAssets, offers,
    initialize, processBroadcastPayload, setMyAssets, setError: setStoreError
  } = useGameStore();

  const [lastDiceRoll, setLastDiceRoll] = useState<LastDiceRoll>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  
  const [currentUserId] = useState(getAnonymousUserId());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentPlayer = players.find(p => p.user_id === currentUserId);

  const refetchMyAssets = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-player-assets', { body: { roomCode, userId: currentUserId } });
      if (error || data.error) throw new Error(error?.message || data.error);
      if (data) setMyAssets({ lands: data.lands, businessTiles: data.businessTiles });
    } catch (e) {
      console.error("Failed to refetch assets:", e);
    }
  }, [roomCode, currentUserId, setMyAssets]);

  const handleGameUpdate = useCallback((payload: any) => {
    const myPlayerId = useGameStore.getState().players.find(p => p.user_id === getAnonymousUserId())?.id;

    switch (payload.type) {
      case 'PLAYER_MOVED':
        setLastDiceRoll({ playerName: payload.playerName, dice1: payload.dice1, dice2: payload.dice2, specialDie: payload.specialDie });
        setTimeout(() => setLastDiceRoll(null), 4000);

        if (payload.tileAction) {
          let actionMessage = '';
          if (payload.tileAction.type === 'drawn_land') actionMessage = `${payload.playerName} rút được Sổ Đỏ [${String.fromCharCode(65 + payload.tileAction.data.x_coord)}${payload.tileAction.data.y_coord + 1}]!`;
          else if (payload.tileAction.type === 'drawn_business') actionMessage = `${payload.playerName} rút được 2 Mảnh Ghép Kinh Doanh!`;
          setLastAction(actionMessage);
          setTimeout(() => setLastAction(null), 4000);
          
          if (payload.playerId === myPlayerId) {
            refetchMyAssets();
          }
        }
        break;
      
      // SỬA LỖI 3: Thêm cơ chế refetch sau khi giao dịch
      case 'OFFER_RESPONDED':
        if (payload.newStatus === 'accepted' && payload.tradeDetails) {
          const { fromPlayerId, toPlayerId } = payload.tradeDetails;
          if (myPlayerId === fromPlayerId || myPlayerId === toPlayerId) {
            setLastAction("Giao dịch thành công!");
            setTimeout(() => setLastAction(null), 4000);
            refetchMyAssets();
          }
        }
        break;
    }
    
    useGameStore.getState().processBroadcastPayload(payload, myPlayerId);
  }, [refetchMyAssets]);

  useEffect(() => {
    setIsMounted(true);
    if (!roomCode) return;

    const setupAndSubscribe = async () => {
      try {
        const [roomStateRes, assetStateRes, roomDataRes, allLandsRes] = await Promise.all([
          supabase.functions.invoke('get-room-state', { body: { roomCode } }),
          supabase.functions.invoke('get-player-assets', { body: { roomCode, userId: currentUserId } }),
          supabase.from('rooms').select('id, status, current_turn_player_id, round_number, current_phase, phase_ends_at').eq('room_code', roomCode.toUpperCase()).single(),
          supabase.functions.invoke('get-all-lands', { body: { roomCode } })
        ]);

        if (roomStateRes.error || roomStateRes.data.error) throw new Error(roomStateRes.error?.message || roomStateRes.data.error);
        if (assetStateRes.error || assetStateRes.data.error) throw new Error(assetStateRes.error?.message || assetStateRes.data.error);
        if (roomDataRes.error) throw roomDataRes.error;
        if (!roomDataRes.data) throw new Error("Room data not found.");
        if (allLandsRes.error || allLandsRes.data.error) throw new Error(allLandsRes.error?.message || allLandsRes.data.error);

        const playersWithColors = roomStateRes.data.players.map((p: any, i: number) => ({ ...p, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }));
        
        initialize({
          status: roomDataRes.data.status,
          players: playersWithColors,
          phase: roomDataRes.data.current_phase,
          roundNumber: roomDataRes.data.round_number,
          phaseEndsAt: roomDataRes.data.phase_ends_at,
          currentTurnPlayerId: roomDataRes.data.current_turn_player_id,
          lands: allLandsRes.data.lands,
        });
        setMyAssets({ lands: assetStateRes.data.lands, businessTiles: assetStateRes.data.businessTiles });

        const roomId = roomDataRes.data.id;
        if (channelRef.current?.topic !== `realtime:room-${roomId}`) {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
            const channel = supabase.channel(`room-${roomId}`);
            channel
              .on('broadcast', { event: 'game_update' }, (message) => handleGameUpdate(message.payload))
              .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') console.log(`✅ Successfully subscribed to channel: room-${roomId}`);
                if (err) console.error("Subscription error:", err);
              });
            channelRef.current = channel;
        }
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

    const handleStartGame = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('start-game', { body: { roomCode, userId: currentUserId } });
        if (error) throw new Error(error.message);
        if (data.error) throw new Error(data.error);

        // Cập nhật store của host ngay lập tức với dữ liệu trả về
        if (data.lands) {
          useGameStore.getState().processBroadcastPayload({ type: 'MAP_CREATED', lands: data.lands }, currentPlayer?.id);
        }

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
      setStoreError('');
      await supabase.functions.invoke('end-building-turn', { 
        body: { roomCode, userId: currentUserId } 
      });
    } catch (e: unknown) {
      setStoreError(e instanceof Error ? e.message : "Failed to end building turn.");
    }
  };

  const handleSelectTile = (tileId: string) => {
    setSelectedTileId(prev => prev === tileId ? null : tileId);
  };

  const handleBuild = async (landId: string) => {
    if (!selectedTileId) {
      setStoreError("Vui lòng chọn một Mảnh Ghép Kinh Doanh từ thanh HUD trước.");
      setTimeout(() => setStoreError(''), 3000);
      return;
    }

    try {
      setStoreError('');
      await supabase.functions.invoke('build-business', {
        body: { roomCode, userId: currentUserId, landId, businessTileId: selectedTileId }
      });
      setSelectedTileId(null);
      refetchMyAssets(); // Refetch sau khi xây
    } catch (e: unknown) {
      setStoreError(e instanceof Error ? e.message : "Failed to build.");
    }
  };

  const isMyTurn = currentPlayer?.id === currentTurnPlayerId;

  if (!isMounted || status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading Game...</div>;
  }

  if (status === 'error') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  if (status === 'ingame') {
    const currentTurnPlayerName = players.find(p => p.id === currentTurnPlayerId)?.nickname || '...';

    return (
      <div className="w-full h-full flex flex-col bg-gray-800 text-white">
        <GamePhaseHeader 
          phase={phase} 
          roundNumber={roundNumber} 
          phaseEndsAt={phaseEndsAt} 
          roomCode={roomCode}
        />
        <div className="w-full flex-grow flex flex-row p-4 gap-4 overflow-hidden">
          
          <div className="w-[300px] flex-shrink-0 bg-gray-900/50 rounded-lg">
            <PlayerList players={players} currentTurnPlayerId={currentTurnPlayerId} />
          </div>

          <div className="flex-grow h-full">
            <GameBoard 
              players={players}
              lands={lands}
              myPlayerId={currentPlayer?.id}
              isMyTurn={isMyTurn}
              phase={phase}
              selectedTileId={selectedTileId}
              onLandClick={handleBuild}
            />
          </div>

          <div className="w-[350px] flex-shrink-0 bg-gray-900/50 rounded-lg p-4 flex flex-col">
            <MyHUD 
              myAssets={myAssets}
              isMyTurn={isMyTurn}
              phase={phase}
              onSelectTile={handleSelectTile}
              selectedTileId={selectedTileId}
            />
            <ActionPanel 
              isMyTurn={isMyTurn}
              phase={phase}
              currentTurnPlayerName={currentTurnPlayerName}
              error={error}
              onRollDice={handleRollDice}
              onEndBuildingTurn={handleEndBuildingTurn}
              onOpenTrade={() => setIsTrading(true)}
            />
          </div>
        </div>

        <AnimatePresence>
          {lastDiceRoll && <DiceResult key="dice-result" playerName={lastDiceRoll.playerName} dice1={lastDiceRoll.dice1} dice2={lastDiceRoll.dice2} specialDie={lastDiceRoll.specialDie} />}
          {lastAction && <ActionToast key="action-toast" message={lastAction} />}
          <TradingModal
            key="trading-modal"
            isOpen={isTrading}
            onClose={() => setIsTrading(false)}
            players={players}
            myPlayerId={currentPlayer?.id || ''}
            myLands={myAssets.lands as LandType[]}
            myBusinessTiles={myAssets.businessTiles as BusinessTileType[]}
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
      </div>
    );
  }
  
  // Giao diện Lobby
  return (
    <Lobby 
      roomCode={roomCode}
      players={players}
      isHost={currentPlayer?.is_host || false}
      onStartGame={handleStartGame}
      error={error}
    />
  );
}

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];