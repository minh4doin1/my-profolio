// src/store/useGameStore.ts

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// --- TYPE DEFINITIONS ---
type GamePhase = 'lobby' | 'movement' | 'trading' | 'building' | 'income';
type GameStatus = 'loading' | 'lobby' | 'ingame' | 'error';

export type Player = {
  id: string;
  user_id: string;
  nickname: string;
  is_host: boolean;
  position_on_path: number;
  color: string;
  gold: number;
};

export type Land = {
  id: string;
  x_coord: number;
  y_coord: number;
  owner_player_id: string | null;
  business_tile_id: string | null;
  business_tile?: { tile_type: string } | null; // Sửa lỗi: Đổi tên từ business_tiles thành business_tile
  land_type: 'buildable' | 'road';
};

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

// --- BROADCAST PAYLOAD TYPES ---
// SỬA LỖI 1: Cập nhật type 'drawn_land' để mong đợi toàn bộ object Land
type TileAction = 
  | { type: 'drawn_land'; data: Land } 
  | { type: 'drawn_business'; data: { tiles: string[] } } 
  | null;

type PlayerJoinedPayload = { type: 'PLAYER_JOINED'; newPlayer: Player };
type GameStartedPayload = { type: 'GAME_STARTED'; startingPlayerId: string };
type PlayerMovedPayload = { type: 'PLAYER_MOVED'; playerId: string; playerName: string; dice1: number; dice2: number; specialDie: number; newPosition: number; tileAction: TileAction; nextTurnPlayerId: string };
type PhaseChangedPayload = { type: 'PHASE_CHANGED'; newPhase: GamePhase; roundNumber: number; phaseEndsAt: string | null; nextTurnPlayerId: string | null };
type NewOfferPayload = { type: 'NEW_OFFER'; offer: Offer };
type OfferRespondedPayload = { type: 'OFFER_RESPONDED'; offerId: string; newStatus: Offer['status']; updatedAssets: Record<string, { gold: number }> | null };
type BuildingPlacedPayload = { type: 'BUILDING_PLACED', playerId: string, land: Land, tile: BusinessTile };

type GameUpdatePayload = 
  | PlayerJoinedPayload 
  | GameStartedPayload 
  | PlayerMovedPayload 
  | PhaseChangedPayload 
  | NewOfferPayload 
  | OfferRespondedPayload
  | BuildingPlacedPayload;

// --- STORE STRUCTURE ---
interface GameState {
  status: GameStatus;
  phase: GamePhase;
  roundNumber: number;
  phaseEndsAt: string | null;
  error: string | null;
  players: Player[];
  currentTurnPlayerId: string | null;
  lands: Land[];
  myAssets: {
    lands: Land[];
    businessTiles: BusinessTile[];
  };
  offers: Offer[];
}

interface GameActions {
  initialize: (initialState: Partial<GameState> & { players: Player[], lands: Land[] }) => void;
  setPlayers: (players: Player[]) => void;
  setMyAssets: (assets: { lands: Land[], businessTiles: BusinessTile[] }) => void;
  setError: (message: string) => void;
  processBroadcastPayload: (payload: GameUpdatePayload, myPlayerId: string | undefined) => void;
}

export const useGameStore = create<GameState & GameActions>()(
  // SỬA LỖI 2: Xóa '_get' không được sử dụng
  immer((set) => ({
    // --- INITIAL STATE ---
    status: 'loading',
    phase: 'lobby',
    roundNumber: 0,
    phaseEndsAt: null,
    error: null,
    players: [],
    currentTurnPlayerId: null,
    lands: [],
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
      state.lands = initialState.lands;
    }),

    setPlayers: (players) => set({ players }),
    setMyAssets: (assets) => set({ myAssets: assets }),
    setError: (message) => set({ error: message }),

    processBroadcastPayload: (payload, myPlayerId) => set(state => {
      console.log('Store processing broadcast:', payload.type, payload);
      switch (payload.type) {
        case 'PLAYER_JOINED': {
          const newPlayer = payload.newPlayer;
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
          const playerIndex = state.players.findIndex((p: Player) => p.id === payload.playerId);
          if (playerIndex !== -1) {
            state.players[playerIndex].position_on_path = payload.newPosition;
          }
          state.currentTurnPlayerId = payload.nextTurnPlayerId;

          // SỬA LỖI 3: Logic này giờ đã an toàn về type
          if (payload.tileAction?.type === 'drawn_land') {
            const updatedLand = payload.tileAction.data;
            const landIndex = state.lands.findIndex(l => l.id === updatedLand.id);
            if (landIndex !== -1) {
              state.lands[landIndex].owner_player_id = updatedLand.owner_player_id;
            }
          }
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
          state.offers = state.offers.filter((o: Offer) => o.id !== offerId);
          if (newStatus === 'accepted' && updatedAssets) {
            state.players.forEach((player: Player) => {
              if (updatedAssets[player.id]) {
                player.gold = updatedAssets[player.id].gold;
              }
            });
          }
          break;
        }
        case 'BUILDING_PLACED': {
          const landIndex = state.lands.findIndex(l => l.id === payload.land.id);
          if (landIndex !== -1) {
            state.lands[landIndex].business_tile_id = payload.tile.id;
            state.lands[landIndex].business_tile = { tile_type: payload.tile.tile_type };
          }

          if (payload.playerId === myPlayerId) {
            state.myAssets.businessTiles = state.myAssets.businessTiles.filter(
              t => t.id !== payload.tile.id
            );
          }
          break;
        }
      }
    }),
  }))
);

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];