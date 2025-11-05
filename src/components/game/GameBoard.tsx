// src/components/game/GameBoard.tsx
"use client";
import { FullGameState } from "@/types/game";

export default function GameBoard({ gameState }: { gameState: FullGameState }) {
  const { game, players } = gameState;
  const boardState = game.board_state;

  if (!boardState) return <div>Loading board...</div>;

  const grid = Array.from({ length: 7 }, () => Array(7).fill(null));

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4 text-white">Game in Progress</h2>
      <div className="grid grid-cols-7 gap-1 bg-gray-900 p-2 rounded-lg">
        {grid.map((row, r_idx) =>
          row.map((_, c_idx) => {
            const coord = `${r_idx},${c_idx}`;
            const tile = boardState.tiles[coord];
            const pawnPlayerId = Object.keys(boardState.pawns).find(
              (pId) => boardState.pawns[pId] === coord
            );
            const pawn = pawnPlayerId ? players.find(p => p.id === pawnPlayerId) : null;

            return (
              <div
                key={coord}
                className={`w-12 h-12 md:w-16 md:h-16 border-2 flex items-center justify-center
                  ${tile?.owner === 'FIRE' ? 'bg-red-900/70 border-red-700' : ''}
                  ${tile?.owner === 'ICE' ? 'bg-blue-900/70 border-blue-700' : ''}
                  ${!tile?.owner ? 'bg-gray-700/50 border-gray-600' : ''}
                `}
              >
                {pawn && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                    ${pawn.team === 'FIRE' ? 'bg-red-500' : 'bg-blue-500'}
                  `}>
                    {pawn.nickname.substring(0, 2)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}