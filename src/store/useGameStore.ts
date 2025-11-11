// src/store/useGameStore.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// --- TYPE DEFINITIONS ---
type GamePhase = 'lobby' | 'movement' | 'trading' | 'building' | 'income';
type GameStatus = 'loading' | 'lobby' | 'ingame' | 'error';

// SỬA LỖI: Định nghĩa các type một cách tường minh để tái sử dụng
export type Player = {
  id: string;
  user_id: string;
  nickname: string;
  is_host: boolean;
  position_on_path: number;
  color: string;
  gold: number;
};

export type Land = { id: string; x_coord: number; y_coord: number; };
export type BusinessTile = { id: string; tile_type: string; };
export type Offer = {
  id: string;
  from_player_id: string;
  to_player_id: string;
  offer_details: { from?: { gold?: number }; to?: { gold?: number } };
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  from_player_nickname?: string;
  to_player_nickname?: string;
};

// SỬA LỖI 1: Tạo một type chung cho tất cả các loại payload từ broadcast
type PlayerJoinedPayload = { type: 'PLAYER_JOINED'; newPlayer: Player };
type GameStartedPayload = { type: 'GAME_STARTED'; startingPlayerId: string };
type TileAction = { type: 'drawn_land'; data: { x: number; y: number } } | { type: 'drawn_business'; data: { tiles: string[] } } | null;
type PlayerMovedPayload = { type: 'PLAYER_MOVED'; playerId: string; playerName: string; dice1: number; dice2: number; specialDie: number; newPosition: number; tileAction: TileAction; nextTurnPlayerId: string };
type PhaseChangedPayload = { type: 'PHASE_CHANGED'; newPhase: GamePhase; roundNumber: number; phaseEndsAt: string | null; nextTurnPlayerId: string | null };
type NewOfferPayload = { type: 'NEW_OFFER'; offer: Offer };
type OfferRespondedPayload = { type: 'OFFER_RESPONDED'; offerId: string; newStatus: Offer['status']; updatedAssets: Record<string, { gold: number }> | null };
type GameUpdatePayload = PlayerJoinedPayload | GameStartedPayload | PlayerMovedPayload | PhaseChangedPayload | NewOfferPayload | OfferRespondedPayload;


// --- ĐỊNH NGHĨA CẤU TRÚC CỦA STORE ---
interface GameState {
  status: GameStatus;
  phase: GamePhase;
  roundNumber: number;
  phaseEndsAt: string | null;
  error: string | null;
  players: Player[];
  currentTurnPlayerId: string | null;
  myAssets: {
    lands: Land[];
    businessTiles: BusinessTile[];
  };
  offers: Offer[];
}

interface GameActions {
  initialize: (initialState: Partial<GameState> & { players: Player[] }) => void;
  setPlayers: (players: Player[]) => void;
  setMyAssets: (assets: { lands: Land[], businessTiles: BusinessTile[] }) => void;
  setError: (message: string) => void;
  processBroadcastPayload: (payload: GameUpdatePayload, myPlayerId: string | undefined) => void;
}

// --- TẠO STORE ---
export const useGameStore = create<GameState & GameActions>()(
  // SỬA LỖI 6: Đổi 'get' thành '_get' để báo hiệu biến không được sử dụng
  immer((set, _get) => ({
    // --- TRẠNG THÁI BAN ĐẦU ---
    status: 'loading',
    phase: 'lobby',
    roundNumber: 0,
    phaseEndsAt: null,
    error: null,
    players: [],
    currentTurnPlayerId: null,
    myAssets: { lands: [], businessTiles: [] },
    offers: [],

    // --- ACTIONS ---
    initialize: (initialState) => set(state => {
      state.status = initialState.status || 'lobby';
      state.players = initialState.players;
      state.phase = initialState.phase || 'lobby';
      state.roundNumber = initialState.roundNumber || 0;
      state.phaseEndsAt = initialState.phaseEndsAt || null;
      state.currentTurnPlayerId = initialState.currentTurnPlayerId || null;
    }),

    setPlayers: (players) => set({ players }),
    setMyAssets: (assets) => set({ myAssets: assets }),
    setError: (message) => set({ error: message }),

    // SỬA LỖI 1: Sử dụng type 'GameUpdatePayload' thay vì 'any'
    processBroadcastPayload: (payload, myPlayerId) => set(state => {
      console.log('Store processing broadcast:', payload.type, payload);
      switch (payload.type) {
        case 'PLAYER_JOINED': {
          const newPlayer = payload.newPlayer;
          // SỬA LỖI 2: Thêm type cho 'p'
          if (!state.players.some((p: Player) => p.id === newPlayer.id)) {
            const newPlayerWithColor = { ...newPlayer, color: PLAYER_COLORS[state.players.length % PLAYER_COLORS.length] };
            state.players.push(newPlayerWithColor);
          }
          break;
        }
        case 'GAME_STARTED':
          state.status = 'ingame';
          state.phase = 'movement';
          state.roundNumber = 1;
          state.currentTurnPlayerId = payload.startingPlayerId;
          break;
        case 'PLAYER_MOVED': {
          // SỬA LỖI 3: Thêm type cho 'p'
          const playerIndex = state.players.findIndex((p: Player) => p.id === payload.playerId);
          if (playerIndex !== -1) {
            state.players[playerIndex].position_on_path = payload.newPosition;
          }
          state.currentTurnPlayerId = payload.nextTurnPlayerId;
          break;
        }
        case 'PHASE_CHANGED':
          state.phase = payload.newPhase;
          state.roundNumber = payload.roundNumber;
          state.phaseEndsAt = payload.phaseEndsAt;
          state.currentTurnPlayerId = payload.nextTurnPlayerId || null;
          if (payload.newPhase !== 'trading') {
            state.offers = [];
          }
          break;
        case 'NEW_OFFER': {
          const newOffer = payload.offer;
          if (newOffer.from_player_id === myPlayerId || newOffer.to_player_id === myPlayerId) {
            state.offers.push(newOffer);
          }
          break;
        }
        case 'OFFER_RESPONDED': {
          const { offerId, newStatus, updatedAssets } = payload;
          // SỬA LỖI 4: Thêm type cho 'o'
          state.offers = state.offers.filter((o: Offer) => o.id !== offerId);
          if (newStatus === 'accepted' && updatedAssets) {
            // SỬA LỖI 5: Thêm type cho 'player'
            state.players.forEach((player: Player) => {
              if (updatedAssets[player.id]) {
                player.gold = updatedAssets[player.id].gold;
              }
            });
          }
          break;
        }
      }
    }),
  }))
);

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];