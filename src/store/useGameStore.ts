import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// --- TYPE DEFINITIONS ---
type GamePhase = 'lobby' | 'movement' | 'trading' | 'building' | 'income';
type GameStatus = 'loading' | 'lobby' | 'ingame' | 'error';

export type PlayerLand = {
  id: string;
  name: string; // e.g., "A1", "C5"
};

export type PlayerBusinessTile = {
  id: string;
  tile_type: string;
};

export type Player = {
  id: string;
  user_id: string;
  nickname: string;
  is_host: boolean;
  position_on_path: number;
  color: string;
  gold: number;
  lands: PlayerLand[];
  business_tiles_in_hand: PlayerBusinessTile[];
};


export type Land = {
  id: string;
  x_coord: number;
  y_coord: number;
  owner_player_id: string | null;
  business_tile_id: string | null;
  business_tiles: { tile_type: string } | null; 
  land_type: 'buildable' | 'road';
};

export type BusinessTile = { id: string; tile_type: string; };

export type Offer = {
  id: string;
  from_player_id: string;
  to_player_id: string;
  offer_details: { 
    from?: { gold?: number; landIds?: string[]; businessTileIds?: string[] }; 
    to?: { gold?: number; landIds?: string[]; businessTileIds?: string[] };
  };
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  from_player_nickname?: string;
  to_player_nickname?: string;
};

// --- BROADCAST PAYLOAD TYPES ---
type TileAction = 
  | { type: 'drawn_land'; data: Land } 
  | { type: 'drawn_business'; data: { tiles: string[] } } 
  | null;

type PlayerJoinedPayload = { type: 'PLAYER_JOINED'; newPlayer: Player };
type GameStartedPayload = { type: 'GAME_STARTED'; startingPlayerId: string };
type PlayerMovedPayload = { type: 'PLAYER_MOVED'; playerId: string; playerName: string; dice1: number; dice2: number; specialDie: number; newPosition: number; tileAction: TileAction; nextTurnPlayerId: string };
type PhaseChangedPayload = { type: 'PHASE_CHANGED'; newPhase: GamePhase; roundNumber: number; phaseEndsAt: string | null; nextTurnPlayerId: string | null };
type NewOfferPayload = { type: 'NEW_OFFER'; offer: Offer };
type OfferRespondedPayload = { 
  type: 'OFFER_RESPONDED'; 
  offerId: string; 
  newStatus: Offer['status']; 
  updatedAssets: Record<string, { gold: number }> | null;
  tradeDetails?: {
    fromPlayerId: string;
    toPlayerId: string;
    lands: { from: string[], to: string[] };
    tiles: { from: string[], to: string[] };
  }
};
type BuildingPlacedPayload = { type: 'BUILDING_PLACED', playerId: string, land: Land, tile: BusinessTile };
type MapCreatedPayload = { type: 'MAP_CREATED', lands: Land[] };
type GameUpdatePayload = 
  | PlayerJoinedPayload 
  | GameStartedPayload 
  | PlayerMovedPayload 
  | PhaseChangedPayload 
  | NewOfferPayload 
  | OfferRespondedPayload
  | BuildingPlacedPayload
  | MapCreatedPayload;

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
            // Đảm bảo người chơi mới luôn có các mảng tài sản
            const completeNewPlayer = {
              ...newPlayer,
              color: PLAYER_COLORS[state.players.length % PLAYER_COLORS.length],
              lands: newPlayer.lands || [],
              business_tiles_in_hand: newPlayer.business_tiles_in_hand || [],
            };
            state.players.push(completeNewPlayer);
          }
          break;
        }
        case 'GAME_STARTED':
          state.status = 'ingame';
          state.phase = 'movement';
          state.roundNumber = 1;
          state.currentTurnPlayerId = payload.startingPlayerId;
          break;
        case 'MAP_CREATED':
          state.lands = payload.lands;
          break;
        case 'PLAYER_MOVED': {
          const playerIndex = state.players.findIndex((p: Player) => p.id === payload.playerId);
          if (playerIndex !== -1) {
            state.players[playerIndex].position_on_path = payload.newPosition;
          }
          state.currentTurnPlayerId = payload.nextTurnPlayerId;

          if (payload.tileAction?.type === 'drawn_land') {
            const updatedLand = payload.tileAction.data;
            const landIndex = state.lands.findIndex(l => l.id === updatedLand.id);
            if (landIndex !== -1) {
              state.lands[landIndex].owner_player_id = updatedLand.owner_player_id;
            }
            // TODO: Update player asset list in a future refactor for consistency
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
            if (!state.offers.some(o => o.id === newOffer.id)) {
              state.offers.push(newOffer);
            }
          }
          break;
        }
        case 'OFFER_RESPONDED': {
          const { offerId, newStatus, updatedAssets, tradeDetails } = payload;
          state.offers = state.offers.filter((o: Offer) => o.id !== offerId);
          
          if (newStatus === 'accepted' && tradeDetails) {
            // --- MODIFICATION START ---
            const fromPlayer = state.players.find(p => p.id === tradeDetails.fromPlayerId);
            const toPlayer = state.players.find(p => p.id === tradeDetails.toPlayerId);

            if (!fromPlayer || !toPlayer) {
              console.error("Could not find players involved in the trade.");
              return; // Exit if players aren't found
            }

            // 1. Cập nhật Vàng (nếu có)
            if (updatedAssets) {
              if (updatedAssets[fromPlayer.id]) fromPlayer.gold = updatedAssets[fromPlayer.id].gold;
              if (updatedAssets[toPlayer.id]) toPlayer.gold = updatedAssets[toPlayer.id].gold;
            }

            // 2. Cập nhật Sổ Đỏ (Lands)
            // Lấy thông tin chi tiết của các Sổ Đỏ được trao đổi từ state.lands chung
            const landsFromSender = fromPlayer.lands.filter(l => tradeDetails.lands.from.includes(l.id));
            const landsFromReceiver = toPlayer.lands.filter(l => tradeDetails.lands.to.includes(l.id));
            
            // Xóa Sổ Đỏ khỏi người cũ và thêm vào người mới
            fromPlayer.lands = fromPlayer.lands.filter(l => !tradeDetails.lands.from.includes(l.id));
            toPlayer.lands.push(...landsFromSender);
            
            toPlayer.lands = toPlayer.lands.filter(l => !tradeDetails.lands.to.includes(l.id));
            fromPlayer.lands.push(...landsFromReceiver);

            // 3. Cập nhật Mảnh Ghép (Business Tiles)
            const tilesFromSender = fromPlayer.business_tiles_in_hand.filter(t => tradeDetails.tiles.from.includes(t.id));
            const tilesFromReceiver = toPlayer.business_tiles_in_hand.filter(t => tradeDetails.tiles.to.includes(t.id));

            // Xóa Mảnh Ghép khỏi người cũ và thêm vào người mới
            fromPlayer.business_tiles_in_hand = fromPlayer.business_tiles_in_hand.filter(t => !tradeDetails.tiles.from.includes(t.id));
            toPlayer.business_tiles_in_hand.push(...tilesFromSender);

            toPlayer.business_tiles_in_hand = toPlayer.business_tiles_in_hand.filter(t => !tradeDetails.tiles.to.includes(t.id));
            fromPlayer.business_tiles_in_hand.push(...tilesFromReceiver);


            // 4. Cập nhật state.lands chung (source of truth for ownership)
            state.lands.forEach(land => {
              if (tradeDetails.lands.from.includes(land.id)) land.owner_player_id = tradeDetails.toPlayerId;
              if (tradeDetails.lands.to.includes(land.id)) land.owner_player_id = tradeDetails.fromPlayerId;
            });

            // 5. Cập nhật myAssets nếu người chơi hiện tại có liên quan
              if (myPlayerId === fromPlayer.id || myPlayerId === toPlayer.id) {
                  const currentPlayerAfterTrade = myPlayerId === fromPlayer.id ? fromPlayer : toPlayer;
                  const newLandIds = new Set(currentPlayerAfterTrade.lands.map(l => l.id));

                  // Lọc lại từ `state.lands` (nguồn chân lý) để đảm bảo đúng type `Land[]`
                  state.myAssets.lands = state.lands.filter(land => newLandIds.has(land.id));

                  // Gán lại business tiles. Type `PlayerBusinessTile` và `BusinessTile` có cấu trúc tương thích.
                  state.myAssets.businessTiles = currentPlayerAfterTrade.business_tiles_in_hand;
              }
            // --- MODIFICATION END ---
          }
          break;
        }
        case 'BUILDING_PLACED': {
          const landIndex = state.lands.findIndex(l => l.id === payload.land.id);
          if (landIndex !== -1) {
            state.lands[landIndex].business_tile_id = payload.tile.id;
            state.lands[landIndex].business_tiles = { tile_type: payload.tile.tile_type };
          }

          if (payload.playerId === myPlayerId) {
            state.myAssets.businessTiles = state.myAssets.businessTiles.filter(
              t => t.id !== payload.tile.id
            );
          }
          // TODO: Update player asset list in a future refactor for consistency
          break;
        }
      }
    }),
  }))
);

const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039'];