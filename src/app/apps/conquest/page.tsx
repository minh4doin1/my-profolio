// src/app/apps/conquest/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Play, LogIn } from "lucide-react";

// Hàm tiện ích để quản lý session_id
const getSessionId = (): string => {
  let sessionId = localStorage.getItem("conquest_session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("conquest_session_id", sessionId);
  }
  return sessionId;
};

export default function ConquestHomePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isLoading, setIsLoading] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const handleCreateGame = async () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname.");
      return;
    }
    setIsLoading("create");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-game`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Key này an toàn để lộ ra ngoài, dùng để Supabase biết request đến từ đâu
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ nickname, session_id: sessionId }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // Lưu thông tin vào localStorage để reconnect
      localStorage.setItem("conquest_game_id", result.game.id);
      localStorage.setItem("conquest_player_id", result.player.id);

      // Chuyển hướng đến phòng chờ
      router.push(`/apps/conquest/${result.game.game_code}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(null);
    }
  };

  const handleJoinGame = async () => {
    if (!nickname.trim() || !gameCode.trim()) {
      setError("Please enter a nickname and a game code.");
      return;
    }
    setIsLoading("join");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/join-game`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            nickname,
            game_code: gameCode,
            session_id: sessionId,
          }),
        }
      );
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      localStorage.setItem("conquest_game_id", result.game.id);
      localStorage.setItem("conquest_player_id", result.player.id);

      router.push(`/apps/conquest/${gameCode.toUpperCase()}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-800/50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* --- Phần Tạo Phòng --- */}
        <div className="bg-gray-900/80 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-white mb-4">
            Create a New Game
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateGame}
              disabled={!!isLoading}
              className="w-full p-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors disabled:bg-gray-500 flex items-center justify-center gap-2"
            >
              {isLoading === "create" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Play />
              )}
              Create Game
            </button>
          </div>
        </div>

        {/* --- Phần Tham gia Phòng --- */}
        <div className="bg-gray-900/80 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-white mb-4">
            Join an Existing Game
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter game code (e.g., ABCD)"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinGame}
              disabled={!!isLoading}
              className="w-full p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-500 flex items-center justify-center gap-2"
            >
              {isLoading === "join" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogIn />
              )}
              Join Game
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}