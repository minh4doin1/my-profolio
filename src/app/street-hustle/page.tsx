// src/app/street-hustle/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getAnonymousUserId } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(''); // 'create' | 'join' | ''
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (!nickname.trim()) { setError('Please enter a nickname.'); return; }
    setIsLoading('create');
    setError('');
    try {
      const userId = getAnonymousUserId();
      const { data, error } = await supabase.functions.invoke('create-room', {
        body: { nickname, userId },
      });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      router.push(`/street-hustle/${data.roomCode}`);
    } catch (err: any) {
      setError(err.message);
      setIsLoading('');
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim() || !roomCode.trim()) { setError('Please enter a nickname and a room code.'); return; }
    setIsLoading('join');
    setError('');
    try {
      const userId = getAnonymousUserId();
      const { data, error } = await supabase.functions.invoke('join-room', {
        body: { roomCode: roomCode.toUpperCase(), nickname, userId },
      });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      // SỬA LỖI: Lưu danh sách người chơi đầy đủ vào sessionStorage
      sessionStorage.setItem('initialPlayers', JSON.stringify(data.players));
      
      router.push(`/street-hustle/${roomCode.toUpperCase()}`);
    } catch (err: any) {
      setError(err.message);
      setIsLoading('');
    }
  };

  // ... JSX giữ nguyên ...
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center">Phố Phường Bát Nháo</h1>
          <p className="mt-2 text-center text-gray-400">Create a room or join with a code</p>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Enter your nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Join a Room</h2>
          <input type="text" placeholder="Enter room code (e.g., ABCD)" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleJoinRoom} disabled={!!isLoading} className="w-full py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 flex items-center justify-center">
            {isLoading === 'join' ? <Loader2 className="animate-spin" /> : 'Join Room'}
          </button>
        </div>
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600" /></div><div className="relative flex justify-center text-sm"><span className="px-2 text-gray-500 bg-gray-800">OR</span></div></div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Create a New Room</h2>
          <button onClick={handleCreateRoom} disabled={!!isLoading} className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 flex items-center justify-center">
            {isLoading === 'create' ? <Loader2 className="animate-spin" /> : 'Create Room'}
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>
    </div>
  );
}