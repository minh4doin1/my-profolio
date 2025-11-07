// src/components/game/GameContainer.tsx
import React from 'react';

type GameContainerProps = {
  children: React.ReactNode;
};

export default function GameContainer({ children }: GameContainerProps) {
  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-yellow-300">
          Phố Phường Bát Nháo
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Street Hustle - Nơi tình bạn rạn nứt vì tiền bạc.
        </p>
        <div className="bg-gray-900/50 p-6 rounded-lg shadow-2xl border border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}