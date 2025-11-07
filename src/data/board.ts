// src/data/board.ts

export type BoardCellType = 'start' | 'land_deed' | 'black_market' | 'event' | 'police' | 'bank';

export interface BoardCell {
  id: number;
  type: BoardCellType;
  name: string;
}

// Định nghĩa 32 ô của Vòng Ngoài
export const boardPath: BoardCell[] = [
  { id: 0, type: 'start', name: 'Start' },
  { id: 1, type: 'land_deed', name: 'Land Deed' },
  { id: 2, type: 'event', name: 'Event !' },
  { id: 3, type: 'land_deed', name: 'Land Deed' },
  { id: 4, type: 'black_market', name: 'Black Market' },
  { id: 5, type: 'land_deed', name: 'Land Deed' },
  { id: 6, type: 'event', name: 'Event !' },
  { id: 7, type: 'land_deed', name: 'Land Deed' },
  { id: 8, type: 'police', name: 'Police' },
  { id: 9, type: 'land_deed', name: 'Land Deed' },
  { id: 10, type: 'event', name: 'Event !' },
  { id: 11, type: 'land_deed', name: 'Land Deed' },
  { id: 12, type: 'black_market', name: 'Black Market' },
  { id: 13, type: 'land_deed', name: 'Land Deed' },
  { id: 14, type: 'event', name: 'Event !' },
  { id: 15, type: 'land_deed', name: 'Land Deed' },
  { id: 16, type: 'bank', name: 'Bank' },
  { id: 17, type: 'land_deed', name: 'Land Deed' },
  { id: 18, type: 'event', name: 'Event !' },
  { id: 19, type: 'land_deed', name: 'Land Deed' },
  { id: 20, type: 'black_market', name: 'Black Market' },
  { id: 21, type: 'land_deed', name: 'Land Deed' },
  { id: 22, type: 'event', name: 'Event !' },
  { id: 23, type: 'land_deed', name: 'Land Deed' },
  { id: 24, type: 'police', name: 'Police (Go back)' },
  { id: 25, type: 'land_deed', name: 'Land Deed' },
  { id: 26, type: 'event', name: 'Event !' },
  { id: 27, type: 'land_deed', name: 'Land Deed' },
  { id: 28, type: 'black_market', name: 'Black Market' },
  { id: 29, type: 'land_deed', name: 'Land Deed' },
  { id: 30, type: 'event', name: 'Event !' },
  { id: 31, type: 'land_deed', name: 'Land Deed' },
];