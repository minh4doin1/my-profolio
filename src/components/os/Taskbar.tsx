"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

// --- SỬA LỖI Ở ĐÂY ---
// 1. Định nghĩa một type cụ thể cho thông tin cửa sổ
type WindowInfo = {
  id: string;
  title: string;
  icon: string;
};

type TaskbarProps = {
  // 2. Sử dụng type WindowInfo[] thay vì any[]
  openWindows: WindowInfo[]; 
  minimizedWindows: string[];
  onTaskbarClick: (id: string) => void;
  activeWindowId: string | null;
};

const Taskbar = ({ openWindows, minimizedWindows, onTaskbarClick, activeWindowId }: TaskbarProps) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/70 backdrop-blur-lg flex items-center justify-between px-4 border-t border-gray-700 z-[9999]">
      {/* Start Menu & App Icons */}
      <div className="flex items-center space-x-2">
        <button className="w-10 h-10 bg-blue-500 rounded-md font-bold text-white flex items-center justify-center">NCM</button>
        {openWindows.map(win => (
          <button 
            key={win.id}
            onClick={() => onTaskbarClick(win.id)}
            className={`h-9 px-3 rounded-md flex items-center space-x-2 transition-all duration-200 border-b-2 ${win.id === activeWindowId && !minimizedWindows.includes(win.id) ? 'bg-blue-500/40 border-blue-400' : 'border-transparent hover:bg-white/10'}`}
            title={win.title}
          >
            <Image src={win.icon} alt={win.title} width={24} height={24} />
            <span className="hidden sm:inline text-white text-sm">{win.title}</span>
          </button>
        ))}
      </div>

      {/* Clock */}
      <div className="text-white text-sm font-semibold">
        {time}
      </div>
    </div>
  );
};

export default Taskbar;