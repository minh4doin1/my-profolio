// src/app/apps/conquest/[gameCode]/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FullGameState, Player, Game, Team } from '@/types/game';
import { Loader2, Edit, Check } from 'lucide-react';
import GameBoard from '@/components/game/GameBoard';

// --- COMPONENT CON: PlayerCard (Để quản lý tên và hiển thị) ---
const PlayerCard = ({ player, isCurrentPlayer }: { player: Player, isCurrentPlayer: boolean }) => {
  // Logic sửa tên sẽ được thêm vào sau để tập trung vào lỗi chính
  return (
    <li className={`bg-gray-800 p-3 rounded flex items-center justify-between border-2 transition-colors ${isCurrentPlayer ? 'border-yellow-400' : 'border-transparent'}`}>
      <span className="font-semibold">{player.nickname}</span>
      <div className="flex items-center gap-2">
        {player.is_host && <span className="text-xs bg-yellow-500 text-black font-bold px-2 py-1 rounded">HOST</span>}
        {/* Thêm nút sửa tên sau */}
      </div>
    </li>
  );
};

// --- COMPONENT CON: Lobby (Giao diện chính) ---
const Lobby = ({ gameState, onStartGame, isStarting }: { gameState: FullGameState, onStartGame: () => void, isStarting: boolean }) => {
  const { game, players } = gameState;
  const [isJoining, setIsJoining] = useState<Team | null>(null);
  const [error, setError] = useState("");

  const currentPlayerId = typeof window !== 'undefined' ? localStorage.getItem("conquest_player_id") : null;
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isHost = currentPlayer?.is_host;

  const teamFire = players.filter(p => p.team === 'FIRE');
  const teamIce = players.filter(p => p.team === 'ICE');

  const canStart = (players.length === 4 || players.length === 6) && teamFire.length === teamIce.length;

  const handleSelectTeam = async (team: Team) => {
    if (!currentPlayerId || !game.id || isJoining) return;
    setIsJoining(team);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/select-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ game_id: game.id, player_id: currentPlayerId, team: team }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      // Không làm gì cả, Realtime sẽ xử lý
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsJoining(null);
    }
  };

  const renderTeam = (team: Team, teamPlayers: Player[], teamColor: string, bgColor: string, borderColor: string) => (
    <div className={`${bgColor} p-4 rounded-lg border ${borderColor} flex flex-col`}>
      <h3 className={`text-2xl font-bold ${teamColor} mb-4 text-center`}>Team {team.charAt(0) + team.slice(1).toLowerCase()} ({teamPlayers.length}/3)</h3>
      <ul className="space-y-2 flex-grow min-h-[200px]">
        {teamPlayers.map(p => <PlayerCard key={p.id} player={p} isCurrentPlayer={p.id === currentPlayerId} />)}
      </ul>
      {teamPlayers.length < 3 && (
        <button onClick={() => handleSelectTeam(team)} disabled={!!isJoining} className={`mt-4 w-full p-2 bg-${teamColor.split('-')[1]}-600 hover:bg-${teamColor.split('-')[1]}-700 rounded font-bold transition-colors disabled:bg-gray-600 disabled:opacity-50 flex justify-center items-center`}>
          {isJoining === team ? <Loader2 className="animate-spin" /> : (currentPlayer?.team === team ? 'Switch Team' : 'Join Team')}
        </button>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 text-white">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Game Lobby</h2>
        <p className="text-gray-400">Share this code:</p>
        <div className="mt-2 inline-block bg-gray-900 px-6 py-2 rounded-lg border border-dashed border-gray-600">
          <span className="text-2xl font-mono tracking-widest text-yellow-300">{game.game_code}</span>
        </div>
      </div>
      {error && <div className="max-w-4xl mx-auto bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-center mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {renderTeam('FIRE', teamFire, 'text-red-300', 'bg-red-900/50', 'border-red-700')}
        {renderTeam('ICE', teamIce, 'text-blue-300', 'bg-blue-900/50', 'border-blue-700')}
      </div>
      <div className="text-center mt-8">
        {isHost ? (
          <button onClick={onStartGame} disabled={!canStart || isStarting} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg text-xl hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center mx-auto">
            {isStarting && <Loader2 className="animate-spin mr-2" />}
            {canStart ? 'Start Game' : 'Waiting for balanced teams (2v2 or 3v3)...'}
          </button>
        ) : <p className="text-gray-400">Waiting for the host to start the game...</p>}
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH CỦA TRANG (ĐÃ TÁI CẤU TRÚC LOGIC) ---
export default function GamePage() {
  const params = useParams();
  const gameCode = params?.gameCode as string;

  const [gameState, setGameState] = useState<FullGameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  // Dùng useCallback để tránh tạo lại hàm fetch không cần thiết
  const fetchInitialGameState = useCallback(async () => {
    if (!gameCode) return;
    try {
      const { data: gameData, error: gameError } = await supabase.from('games').select('*').eq('game_code', gameCode.toUpperCase()).single();
      if (gameError || !gameData) throw new Error('Game not found.');
      const { data: playersData, error: playersError } = await supabase.from('players').select('*').eq('game_id', gameData.id);
      if (playersError) throw new Error('Could not fetch players.');
      setGameState({ game: gameData, players: playersData || [] });
      setError(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [gameCode]);

  useEffect(() => {
    if (!gameCode) return;

    // Fetch dữ liệu lần đầu
    fetchInitialGameState();

    // Thiết lập kênh Realtime
    const channel = supabase.channel(`game-room-${gameCode}`)
      .on<Player>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `game_id=eq.${gameState?.game.id}` },
        (payload) => {
          console.log('Player change received:', payload);
          setGameState((current) => {
            if (!current) return null;
            let newPlayers = [...current.players];
            if (payload.eventType === 'INSERT') {
              newPlayers.push(payload.new);
            } else if (payload.eventType === 'UPDATE') {
              newPlayers = newPlayers.map(p => p.id === payload.new.id ? payload.new : p);
            } else if (payload.eventType === 'DELETE') {
              newPlayers = newPlayers.filter(p => p.id !== (payload.old as Player).id);
            }
            return { ...current, players: newPlayers };
          });
        }
      )
      .on<Game>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameState?.game.id}` },
        (payload) => {
          console.log('Game state updated:', payload);
          setGameState(current => current ? { ...current, game: payload.new } : null);
        }
      )
      .subscribe();

    // Dọn dẹp khi component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode, gameState?.game.id, fetchInitialGameState]);

  const handleStartGame = async () => {
    const playerId = localStorage.getItem("conquest_player_id");
    if (!gameState || !playerId) return;
    setIsStarting(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/start-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ game_id: gameState.game.id, player_id: playerId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) return <div className="w-full h-full flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading game...</div>;
  if (error) return <div className="w-full h-full flex items-center justify-center text-red-400">{error}</div>;
  if (!gameState) return <div className="w-full h-full flex items-center justify-center text-gray-500">Could not load game state.</div>;

  switch (gameState.game.status) {
    case 'lobby':
      return <Lobby gameState={gameState} onStartGame={handleStartGame} isStarting={isStarting} />;
    case 'in_progress':
      return <GameBoard gameState={gameState} />;
    default:
      return <div>Unknown game status: {gameState.game.status}</div>;
  }
}