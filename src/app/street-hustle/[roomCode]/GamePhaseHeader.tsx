// src/app/street-hustle/[roomCode]/GamePhaseHeader.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Timer, Swords, Building, PiggyBank, Footprints } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type GamePhase = 'lobby' | 'movement' | 'trading' | 'building' | 'income';

interface GamePhaseHeaderProps {
  phase: GamePhase;
  roundNumber: number;
  phaseEndsAt: string | null;
  roomCode: string;
}

const phaseInfo: Record<GamePhase, { text: string; icon: React.ReactNode }> = {
  movement: { text: 'Giai đoạn Di chuyển', icon: <Footprints className="w-5 h-5" /> },
  trading: { text: 'Giai đoạn Đàm phán', icon: <Swords className="w-5 h-5" /> },
  building: { text: 'Giai đoạn Xây dựng', icon: <Building className="w-5 h-5" /> },
  income: { text: 'Giai đoạn Thu nhập', icon: <PiggyBank className="w-5 h-5" /> },
  lobby: { text: 'Phòng chờ', icon: <></> },
};

export default function GamePhaseHeader({ phase, roundNumber, phaseEndsAt }: GamePhaseHeaderProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const hasTriggeredEndPhase = useRef(false);

  useEffect(() => {
    if (phase !== 'trading' || !phaseEndsAt) {
      setTimeLeft('');
      hasTriggeredEndPhase.current = false;
      return;
    }

    const interval = setInterval(() => {
      const endTime = new Date(phaseEndsAt).getTime();
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        if (!hasTriggeredEndPhase.current) {
          hasTriggeredEndPhase.current = true;
          console.log("Timer ended. Requesting phase end...");
          supabase.functions.invoke('request-end-phase', {
            body: { roomCode }
          }).catch(err => console.error("Error requesting phase end:", err));
        }
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, phaseEndsAt]);

  const info = phaseInfo[phase];
  if (!info || phase === 'lobby') return null;

  return (
    <div className="w-full bg-gray-900 text-white p-2 flex justify-center items-center gap-4 text-lg font-bold border-b border-gray-700 flex-shrink-0">
      <span>Vòng {roundNumber}</span>
      <span className="w-px h-6 bg-gray-700"></span>
      <div className="flex items-center gap-2">
        {info.icon}
        <span>{info.text}</span>
      </div>
      {phase === 'trading' && timeLeft && (
        <div className="flex items-center gap-2 text-yellow-400">
          <Timer className="w-5 h-5" />
          <span>{timeLeft}</span>
        </div>
      )}
    </div>
  );
}