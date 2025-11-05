// src/lib/hooks/useGameSession.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FullGameState } from '@/types/game';

export function useGameSession(gameCode: string) {
  const [gameState, setGameState] = useState<FullGameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGameState = useCallback(async () => {
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
    fetchGameState(); // Fetch lần đầu

    const channel = supabase.channel(`game-room-broadcast-${gameCode}`)
      .on('broadcast', { event: 'STATE_CHANGED' }, (payload) => {
        console.log('STATE_CHANGED event received!', payload);
        fetchGameState(); // Fetch lại toàn bộ state khi có thông báo
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode, fetchGameState]);

  return { gameState, error, isLoading };
}