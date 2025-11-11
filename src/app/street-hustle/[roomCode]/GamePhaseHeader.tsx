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

export default function GamePhaseHeader({ phase, roundNumber, phaseEndsAt, roomCode }: GamePhaseHeaderProps) {
  const [timeLeft, setTimeLeft] = useState('');
  // SỬA LỖI: Dùng useRef để tránh re-render không cần thiết
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredEndPhase = useRef(false);

  useEffect(() => {
    // Dọn dẹp interval cũ trước khi tạo cái mới
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Nếu không phải giai đoạn trading hoặc không có thời gian kết thúc, không làm gì cả
    if (phase !== 'trading' || !phaseEndsAt) {
      setTimeLeft('');
      hasTriggeredEndPhase.current = false;
      return;
    }

    // Đảm bảo chỉ chạy khi có roomCode
    if (!roomCode) return;

    // Reset lại cờ khi bắt đầu một giai đoạn trading mới
    hasTriggeredEndPhase.current = false;

    const calculateTimeLeft = () => {
      const endTime = new Date(phaseEndsAt).getTime();
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft("00:00");
        if (!hasTriggeredEndPhase.current) {
          hasTriggeredEndPhase.current = true;
          console.log("Timer ended. Requesting phase end...");
          supabase.functions.invoke('request-end-phase', {
            body: { roomCode }
          }).catch(err => console.error("Error requesting phase end:", err));
        }
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };
    
    // Gọi lần đầu để hiển thị ngay lập tức
    calculateTimeLeft();

    // Thiết lập interval
    intervalRef.current = setInterval(calculateTimeLeft, 1000);

    // Hàm dọn dẹp của useEffect
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // SỬA LỖI: Thêm roomCode vào dependency array
  }, [phase, phaseEndsAt, roomCode]);

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