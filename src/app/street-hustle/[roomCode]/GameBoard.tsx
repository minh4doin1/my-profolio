// src/app/street-hustle/[roomCode]/GameBoard.tsx
"use client";

import { boardTiles, BoardTile } from './boardData';

type Player = {
  id: string;
  nickname: string;
  position_on_path: number;
  color: string;
};

interface GameBoardProps {
  players: Player[];
}

const Tile = ({ tile }: { tile: BoardTile }) => {
  return (
    <div className="border border-black flex flex-col justify-center items-center p-1 text-center text-xs font-bold bg-gray-200">
      <div className="w-full h-4 bg-blue-500 mb-1"></div>
      <span>{tile.name}</span>
    </div>
  );
};

const PlayerPiece = ({ player, index }: { player: Player, index: number }) => {
  const tile = boardTiles[player.position_on_path];
  
  // SỬA LỖI 1: Dùng 'const' thay vì 'let'
  const styles: React.CSSProperties = {
    backgroundColor: player.color,
    transition: 'all 0.5s ease-in-out',
    // Dàn các quân cờ ra để không đè lên nhau
    transform: `translate(${index * 5}px, ${index * 5}px)`,
  };

  // SỬA LỖI 2: Xóa biến 'offset' không sử dụng
  // const offset = `${index * 10 + 5}%`; // Dòng này đã bị xóa

  // Logic định vị quân cờ
  if (tile.position === 'bottom') {
    styles.bottom = '5%';
    styles.right = `${(tile.id) * 11.1 + 2}%`;
  } else if (tile.position === 'left') {
    styles.left = '5%';
    styles.bottom = `${(tile.id - 8) * 11.1 + 2}%`;
  } else if (tile.position === 'top') {
    styles.top = '5%';
    styles.left = `${(tile.id - 16) * 11.1 + 2}%`;
  } else if (tile.position === 'right') {
    styles.right = '5%';
    styles.top = `${(tile.id - 24) * 11.1 + 2}%`;
  }

  return (
    <div
      className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg"
      style={styles}
      title={player.nickname}
    ></div>
  );
};

export default function GameBoard({ players }: GameBoardProps) {
  const bottomRow = boardTiles.filter(t => t.position === 'bottom').reverse();
  const leftRow = boardTiles.filter(t => t.position === 'left').reverse();
  const topRow = boardTiles.filter(t => t.position === 'top');
  const rightRow = boardTiles.filter(t => t.position === 'right');

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-800 p-4">
      <div className="aspect-square w-full max-w-4xl relative">
        <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-green-700 flex justify-center items-center">
          <h1 className="text-4xl font-bold text-white transform -rotate-45">Phố Phường Bát Nháo</h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[10%] grid grid-cols-9">
          {bottomRow.map(tile => <Tile key={tile.id} tile={tile} />)}
        </div>
        <div className="absolute top-0 left-0 w-[10%] h-full grid grid-rows-9">
          {leftRow.map(tile => <Tile key={tile.id} tile={tile} />)}
        </div>
        <div className="absolute top-0 left-0 w-full h-[10%] grid grid-cols-9">
          {topRow.map(tile => <Tile key={tile.id} tile={tile} />)}
        </div>
        <div className="absolute top-0 right-0 w-[10%] h-full grid grid-rows-9">
          {rightRow.map(tile => <Tile key={tile.id} tile={tile} />)}
        </div>
        {players.map((p, index) => <PlayerPiece key={p.id} player={p} index={index} />)}
      </div>
    </div>
  );
}