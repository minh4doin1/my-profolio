// src/app/apps/conquest/[gameCode]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// SỬA LỖI 3: Xóa import 'Player' không sử dụng
import { FullGameState } from '@/types/game';
import { Loader2 } from 'lucide-react';

// Component con để hiển thị Lobby UI (Không thay đổi)
const Lobby = ({ gameState }: { gameState: FullGameState }) => {
  // ... (Nội dung component Lobby giữ nguyên)
  const { game, players } = gameState;

  const teamFire = players.filter(p => p.team === 'FIRE');
  const teamIce = players.filter(p => p.team === 'ICE');

  return (
    <div className="p-4 md:p-8 text-white">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Game Lobby</h2>
        <p className="text-gray-400">Share this code with your friends to join:</p>
        <div className="mt-2 inline-block bg-gray-900 px-6 py-2 rounded-lg border border-dashed border-gray-600">
          <span className="text-2xl font-mono tracking-widest text-yellow-300">{game.game_code}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Team Fire */}
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700">
          <h3 className="text-2xl font-bold text-red-300 mb-4 text-center">Team Fire</h3>
          <ul className="space-y-2">
            {teamFire.map(player => (
              <li key={player.id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
                <span className="font-semibold">{player.nickname}</span>
                {player.is_host && <span className="text-xs bg-yellow-500 text-black font-bold px-2 py-1 rounded">HOST</span>}
              </li>
            ))}
            {Array.from({ length: 3 - teamFire.length }).map((_, i) => (
              <li key={i} className="bg-gray-800/50 p-3 rounded text-center text-gray-500 italic">Empty Slot</li>
            ))}
          </ul>
        </div>

        {/* Team Ice */}
        <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
          <h3 className="text-2xl font-bold text-blue-300 mb-4 text-center">Team Ice</h3>
           <ul className="space-y-2">
            {teamIce.map(player => (
              <li key={player.id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
                <span className="font-semibold">{player.nickname}</span>
                {player.is_host && <span className="text-xs bg-yellow-500 text-black font-bold px-2 py-1 rounded">HOST</span>}
              </li>
            ))}
            {Array.from({ length: 3 - teamIce.length }).map((_, i) => (
              <li key={i} className="bg-gray-800/50 p-3 rounded text-center text-gray-500 italic">Empty Slot</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg text-xl hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
          Start Game (Waiting for players...)
        </button>
      </div>
    </div>
  );
};


// Component chính của trang
export default function GamePage() {
  const params = useParams();
  // SỬA LỖI 1: Sử dụng optional chaining (?.) để truy cập an toàn
  const gameCode = params?.gameCode as string;

  const [gameState, setGameState] = useState<FullGameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameCode) return;

    const fetchInitialState = async () => {
      setIsLoading(true); // Bật loading khi fetch lại
      try {
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('game_code', gameCode.toUpperCase())
          .single();

        if (gameError || !gameData) throw new Error('Game not found.');

        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', gameData.id);
        
        if (playersError) throw new Error('Could not fetch players.');

        setGameState({ game: gameData, players: playersData || [] });
        setError(null); // Xóa lỗi cũ nếu fetch thành công
      } catch (err) {
        // SỬA LỖI 2: Xử lý kiểu lỗi một cách an toàn
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialState();

    const channel = supabase
      .channel(`game-${gameCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        (payload) => {
          console.log('Player change received!', payload);
          fetchInitialState(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [gameCode]);


  if (isLoading && !gameState) { // Chỉ hiển thị loading toàn màn hình lần đầu
    return <div className="w-full h-full flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading game...</div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center text-red-400">{error}</div>;
  }

  if (!gameState) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">Could not load game state.</div>;
  }

  switch (gameState.game.status) {
    case 'lobby':
      return <Lobby gameState={gameState} />;
    default:
      return <div>Unknown game status: {gameState.game.status}</div>;
  }
}