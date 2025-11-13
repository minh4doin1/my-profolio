// NỘI DUNG MỚI CHO CẢ 2 FILE boardData.ts

export interface BoardTile {
  id: number;
  name: string;
  type: 'start' | 'property' | 'chance' | 'police' | 'market' | 'bank';
  position: 'bottom' | 'left' | 'top' | 'right';
}

export const BOARD_SIZE = 44;

export const boardTiles: BoardTile[] = [
  // Bottom Row (id 0-11)
  { id: 0, name: 'Bắt Đầu', type: 'start', position: 'bottom' },
  { id: 1, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 2, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 3, name: 'Sự Kiện', type: 'chance', position: 'bottom' },
  { id: 4, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 5, name: 'Chợ Đen', type: 'market', position: 'bottom' },
  { id: 6, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 7, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 8, name: 'Sự Kiện', type: 'chance', position: 'bottom' },
  { id: 9, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 10, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 11, name: 'Vào Tù', type: 'police', position: 'bottom' },

  // Left Column (id 12-21)
  { id: 12, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 13, name: 'Chợ Đen', type: 'market', position: 'left' },
  { id: 14, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 15, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 16, name: 'Sự Kiện', type: 'chance', position: 'left' },
  { id: 17, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 18, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 19, name: 'Chợ Đen', type: 'market', position: 'left' },
  { id: 20, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 21, name: 'Đất Đai', type: 'property', position: 'left' },

  // Top Row (id 22-33)
  { id: 22, name: 'Ngân Hàng', type: 'bank', position: 'top' },
  { id: 23, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 24, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 25, name: 'Sự Kiện', type: 'chance', position: 'top' },
  { id: 26, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 27, name: 'Chợ Đen', type: 'market', position: 'top' },
  { id: 28, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 29, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 30, name: 'Sự Kiện', type: 'chance', position: 'top' },
  { id: 31, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 32, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 33, name: 'Cảnh Sát', type: 'police', position: 'top' },

  // Right Column (id 34-43)
  { id: 34, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 35, name: 'Chợ Đen', type: 'market', position: 'right' },
  { id: 36, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 37, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 38, name: 'Sự Kiện', type: 'chance', position: 'right' },
  { id: 39, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 40, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 41, name: 'Chợ Đen', type: 'market', position: 'right' },
  { id: 42, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 43, name: 'Đất Đai', type: 'property', position: 'right' },
]; 