// src/app/street-hustle/[roomCode]/PlayerHUD.tsx
"use client";

// Định nghĩa các kiểu dữ liệu tài sản
type Land = { id: string; x_coord: number; y_coord: number; };
type BusinessTile = { id: string; tile_type: string; };

interface PlayerHUDProps {
  myLands: Land[];
  myBusinessTiles: BusinessTile[];
}

export default function PlayerHUD({ myLands, myBusinessTiles }: PlayerHUDProps) {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-gray-900/80 backdrop-blur-sm text-white p-4 border-t-2 border-blue-500">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold text-lg">Sổ Đỏ Của Bạn ({myLands.length})</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {myLands.map(land => (
              <span key={land.id} className="bg-green-600 px-2 py-1 rounded text-sm">
                {String.fromCharCode(65 + land.x_coord)}{land.y_coord + 1}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg">Kinh Doanh Trên Tay ({myBusinessTiles.length})</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {myBusinessTiles.map(tile => (
              <span key={tile.id} className="bg-yellow-600 px-2 py-1 rounded text-sm capitalize">
                {tile.tile_type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}