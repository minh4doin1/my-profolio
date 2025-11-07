// src/store/useGameStore.ts

import { create } from 'zustand';

// Tái sử dụng các type đã có
type Player = {
  id: string;
  nickname: string;
  is_host: boolean;
  user_id: string;
};

type GameStatus = 'lobby' | 'in_game' | 'trading' | 'building' | 'income' | 'minigame' | 'finished';

type RoomState = {
  id: string | null;
  room_code: string | null;
  status: GameStatus;
  players: Player[];
};

type GameState = {
  room: RoomState;
  setInitialRoomData: (data: { room_code: string; host: Player }) => void;
  // Sẽ thêm các action khác sau này
};

export const useGameStore = create<GameState>((set) => ({
  room: {
    id: null,
    room_code: null,
    status: 'lobby',
    players: [],
  },
  
  // Action để thiết lập dữ liệu ban đầu khi host tạo phòng
  setInitialRoomData: ({ room_code, host }) => set({
    room: {
      id: null, // Chúng ta chưa biết ID phòng, sẽ được cập nhật sau
      room_code: room_code,
      status: 'lobby',
      players: [host], // Thêm host vào danh sách người chơi
    }
  }),
}));