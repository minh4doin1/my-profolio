// src/app/street-hustle/[roomCode]/DiceResult.tsx
"use client";

import { motion } from 'framer-motion';

interface DiceResultProps {
  playerName: string;
  dice1: number;
  dice2: number;
  specialDie: number;
}

// Component con để vẽ một mặt xúc xắc
const Die = ({ value, isSpecial = false }: { value: number, isSpecial?: boolean }) => {
  const bgColor = isSpecial ? 'bg-purple-500' : 'bg-white';
  const dotColor = isSpecial ? 'text-white' : 'text-black';
  
  return (
    <div className={`w-20 h-20 rounded-lg shadow-md flex items-center justify-center ${bgColor}`}>
      <span className={`text-5xl font-bold ${dotColor}`}>{value}</span>
    </div>
  );
};

export default function DiceResult({ playerName, dice1, dice2, specialDie }: DiceResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-600"
    >
      <div className="flex flex-col items-center text-white">
        <p className="text-lg font-semibold mb-4">{playerName} đã tung được</p>
        <div className="flex items-center gap-4">
          <Die value={dice1} />
          <span className="text-5xl font-bold mx-2">+</span>
          <Die value={dice2} />
          <span className="text-5xl font-bold mx-2">=</span>
          <span className="text-7xl font-bold text-blue-400">{dice1 + dice2}</span>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-sm text-gray-300">Xúc xắc Sự kiện:</p>
            <Die value={specialDie} isSpecial={true} />
        </div>
      </div>
    </motion.div>
  );
}