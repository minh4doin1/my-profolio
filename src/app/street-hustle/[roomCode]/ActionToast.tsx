// src/app/street-hustle/[roomCode]/ActionToast.tsx
"use client";

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface ActionToastProps {
  message: string;
}

export default function ActionToast({ message }: ActionToastProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg border border-gray-600"
    >
      <Info className="text-blue-400" />
      <p className="font-medium">{message}</p>
    </motion.div>
  );
}