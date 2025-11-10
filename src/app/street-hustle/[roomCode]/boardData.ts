// src/app/street-hustle/[roomCode]/boardData.ts

export interface BoardTile {
  id: number;
  name: string;
  type: 'start' | 'property' | 'chance' | 'police' | 'market' | 'bank';
  position: 'bottom' | 'left' | 'top' | 'right';
}

// Đây là bản đồ 32 ô của chúng ta
export const boardTiles: BoardTile[] = [
  // Bottom Row (từ phải qua trái)
  { id: 0, name: 'Bắt Đầu', type: 'start', position: 'bottom' },
  { id: 1, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 2, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 3, name: 'Sự Kiện', type: 'chance', position: 'bottom' },
  { id: 4, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 5, name: 'Chợ Đen', type: 'market', position: 'bottom' },
  { id: 6, name: 'Đất Đai', type: 'property', position: 'bottom' },
  { id: 7, name: 'Đất Đai', type: 'property', position: 'bottom' },
  
  // Left Column (từ dưới lên trên)
  { id: 8, name: 'Cảnh Sát', type: 'police', position: 'left' },
  { id: 9, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 10, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 11, name: 'Sự Kiện', type: 'chance', position: 'left' },
  { id: 12, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 13, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 14, name: 'Đất Đai', type: 'property', position: 'left' },
  { id: 15, name: 'Đất Đai', type: 'property', position: 'left' },

  // Top Row (từ trái qua phải)
  { id: 16, name: 'Ngân Hàng', type: 'bank', position: 'top' },
  { id: 17, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 18, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 19, name: 'Sự Kiện', type: 'chance', position: 'top' },
  { id: 20, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 21, name: 'Chợ Đen', type: 'market', position: 'top' },
  { id: 22, name: 'Đất Đai', type: 'property', position: 'top' },
  { id: 23, name: 'Đất Đai', type: 'property', position: 'top' },

  // Right Column (từ trên xuống dưới)
  { id: 24, name: 'Về Tù', type: 'police', position: 'right' },
  { id: 25, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 26, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 27, name: 'Sự Kiện', type: 'chance', position: 'right' },
  { id: 28, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 29, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 30, name: 'Đất Đai', type: 'property', position: 'right' },
  { id: 31, name: 'Đất Đai', type: 'property', position: 'right' },
];