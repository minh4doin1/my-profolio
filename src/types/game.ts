// src/types/game.ts

// --- ENUMS & LITERAL TYPES ---
// Sử dụng các kiểu chữ cụ thể thay vì chuỗi tự do để tránh lỗi chính tả.
export type GameMode = 'CONQUEST' | 'ARCADE_REFLEX' | 'ARCADE_TYPING';
export type GameStatus = 'lobby' | 'in_progress' | 'finished' | 'minigame_reflex' | 'minigame_typing';
export type Team = 'FIRE' | 'ICE';

// --- DATABASE-RELATED TYPES ---
// Phản ánh cấu trúc của các bảng trong Supabase.

export interface Player {
  id: string; // uuid, khóa chính của player
  game_id: string; // uuid
  // Đổi tên user_id thành session_id để phản ánh đúng bản chất
  // Đây là ID định danh duy nhất cho một trình duyệt trong một game
  session_id: string; // uuid (from localStorage)
  nickname: string;
  team: Team | null;
  is_host: boolean;
}

export interface Game {
  id: string; // uuid
  game_code: string;
  game_mode: GameMode;
  status: GameStatus;
  host_id: string | null; // uuid of the player who is the host
  current_turn_player_id: string | null; // uuid of the current player
  board_state: ConquestBoardState | null;
  minigame_state: ReflexMinigameState | TypingMinigameState | null;
  created_at: string; // timestamp
}


// --- GAME STATE TYPES ---
// Định nghĩa cấu trúc cho các cột JSONB.

// 1. CONQUEST MODE
export interface ConquestBoardState {
  // Ví dụ: { "0,0": { owner: "FIRE", level: 1 }, "0,1": { owner: null, level: 0 } }
  tiles: {
    [coordinates: string]: {
      owner: Team | null;
      level: number;
    };
  };
  // Ví dụ: { "player_uuid_1": "0,0", "player_uuid_2": "5,5" }
  pawns: {
    [playerId: string]: string; // key là player.id, value là tọa độ "x,y"
  };
  teams: {
    [team in Team]: {
      score: number;
      resources: number;
    }
  }
}

// 2. MINIGAME: QUICK REFLEX
export interface ReflexMinigameState {
  round: number;
  target: { x: number; y: number }; // Tọa độ của mục tiêu
  scores: {
    [playerId: string]: number;
  };
  challenger_1: string; // player.id
  challenger_2: string; // player.id
}

// 3. MINIGAME: TEAM TYPING
export interface TypingMinigameState {
  text_id: string; // ID của đoạn văn bản cần gõ
  progress: {
    [team in Team]: number; // Tiến độ từ 0-100
  };
}

// --- COMPOSITE TYPE FOR FRONTEND ---
// Một kiểu dữ liệu tổng hợp, tiện lợi cho việc quản lý state ở client.
export interface FullGameState {
  game: Game;
  players: Player[];
}