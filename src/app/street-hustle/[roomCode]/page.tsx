// src/app/street-hustle/[roomCode]/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase, getAnonymousUserId } from '@/lib/supabase';
import { Loader2, User, Crown } from 'lucide-react';
import { RealtimeChannel } from '@supabase/supabase-js';

type Player = {
  id: string;
  user_id: string;
  nickname: string;
  is_host: boolean;
};

export default function LobbyPage() {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId] = useState(getAnonymousUserId());
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!roomCode) return;
    console.log(`[LobbyPage] Mounting for room: ${roomCode}. Current user: ${currentUserId}`);

    const setupLobby = async () => {
      try {
        // SỬA LỖI: Ưu tiên sessionStorage, nếu không có thì mới fetch
        const initialPlayersRaw = sessionStorage.getItem('initialPlayers');
        if (initialPlayersRaw) {
          console.log("[LobbyPage] Found initial players in sessionStorage.");
          setPlayers(JSON.parse(initialPlayersRaw));
          sessionStorage.removeItem('initialPlayers');
        } else {
          console.log("[LobbyPage] No initial players in sessionStorage. Calling 'get-room-state'...");
          const { data, error: funcError } = await supabase.functions.invoke('get-room-state', {
            body: { roomCode },
          });
          if (funcError) throw new Error(funcError.message);
          if (data.error) throw new Error(data.error);
          console.log("[LobbyPage] Initial state received from function:", data.players);
          setPlayers(data.players);
        }

        // Lấy roomId để subscribe
        const { data: roomData } = await supabase.from('rooms').select('id').eq('room_code', roomCode.toUpperCase()).single();
        if (!roomData) throw new Error("Could not find room to subscribe.");

        // Lắng nghe broadcast
        const channel = supabase.channel(`room-${roomData.id}`);
        channel.on('broadcast', { event: 'player_joined' }, (payload) => {
          console.log("[LobbyPage] Broadcast 'player_joined' received!", payload);
          const newPlayer = payload.payload.newPlayer as Player;
          setPlayers(currentPlayers => {
            if (currentPlayers.some(p => p.id === newPlayer.id)) {
              console.log(`[LobbyPage] Player ${newPlayer.nickname} already in state. Ignoring broadcast.`);
              return currentPlayers;
            }
            console.log(`[LobbyPage] Adding new player ${newPlayer.nickname} to state.`);
            return [...currentPlayers, newPlayer];
          });
        }).subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[LobbyPage] ✅ Successfully subscribed to custom events on channel: room-${roomData.id}`);
          }
          if (err) {
            console.error("[LobbyPage] Subscription error:", err);
          }
        });
        channelRef.current = channel;

      } catch (e: any) {
        console.error("[LobbyPage] Error in setupLobby:", e.message);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    setupLobby();

    return () => {
      if (channelRef.current) {
        console.log("[LobbyPage] Unsubscribing from channel.");
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomCode, currentUserId]);

  // ... JSX giữ nguyên ...
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white"><Loader2 className="animate-spin" size={48} /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400"><p>Error: {error}</p></div>;
  }

  const currentPlayer = players.find(p => p.user_id === currentUserId);
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
                {player.is_host ? (
                  <Crown className="w-6 h-6 mr-3 text-yellow-400" />
                ) : (
                  <User className="w-6 h-6 mr-3 text-gray-400" />
                )}
                <span className="font-medium">{player.nickname}</span>
              </div>
            ))}
          </div>
        </div>
        {isCurrentUserHost && (
          <button
            className="w-full py-3 mt-4 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500"
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}