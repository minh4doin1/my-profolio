// src/app/street-hustle/[roomCode]/TradingModal.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Lấy lại các type từ GamePage
type Player = { id: string; user_id: string; nickname: string; is_host: boolean; position_on_path: number; color: string; };
type Land = { id: string; x_coord: number; y_coord: number; };
type BusinessTile = { id: string; tile_type: string; };

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  myPlayerId: string;
  myLands: Land[];
  myBusinessTiles: BusinessTile[];
  roomCode: string;
  currentUserId: string;
}

export default function TradingModal({
  isOpen,
  onClose,
  players,
  myPlayerId,
  myLands,
  myBusinessTiles,
  roomCode,
  currentUserId
}: TradingModalProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [myGoldOffer, setMyGoldOffer] = useState(0);
  const [theirGoldOffer, setTheirGoldOffer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const otherPlayers = players.filter(p => p.id !== myPlayerId);

  const handleSendOffer = async () => {
    if (!selectedPlayerId) {
      setError('Please select a player to trade with.');
      return;
    }
    setIsSending(true);
    setError('');

    const offerDetails = {
      from: { gold: myGoldOffer > 0 ? myGoldOffer : undefined },
      to: { gold: theirGoldOffer > 0 ? theirGoldOffer : undefined }
    };

    try {
      const { error: funcError } = await supabase.functions.invoke('create-offer', {
        body: {
          roomCode,
          userId: currentUserId,
          toPlayerId: selectedPlayerId,
          offerDetails
        }
      });
      if (funcError) throw new Error(funcError.message);
      
      // Thành công!
      onClose(); // Đóng modal sau khi gửi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-2xl font-bold">Bàn Đàm Phán</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X /></button>
        </div>

        {/* --- Nội dung Modal --- */}
        <div className="space-y-4">
          <div>
            <label htmlFor="player-select" className="block mb-2 font-semibold">Giao dịch với:</label>
            <select
              id="player-select"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            >
              <option value="" disabled>-- Chọn người chơi --</option>
              {otherPlayers.map(p => (
                <option key={p.id} value={p.id}>{p.nickname}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cột của bạn */}
            <div className="p-4 bg-gray-900/50 rounded">
              <h3 className="font-bold text-lg text-blue-400">Bạn đưa</h3>
              <div className="mt-2">
                <label>Vàng:</label>
                <input type="number" value={myGoldOffer} onChange={e => setMyGoldOffer(Number(e.target.value))} className="w-full p-1 bg-gray-700 rounded mt-1" />
              </div>
              {/* TODO: Thêm UI chọn Sổ Đỏ và Mảnh Ghép */}
            </div>
            {/* Cột của họ */}
            <div className="p-4 bg-gray-900/50 rounded">
              <h3 className="font-bold text-lg text-green-400">Bạn nhận</h3>
              <div className="mt-2">
                <label>Vàng:</label>
                <input type="number" value={theirGoldOffer} onChange={e => setTheirGoldOffer(Number(e.target.value))} className="w-full p-1 bg-gray-700 rounded mt-1" />
              </div>
              {/* TODO: Thêm UI chọn Sổ Đỏ và Mảnh Ghép của họ */}
            </div>
          </div>
        </div>

        {/* --- Chân Modal --- */}
        <div className="mt-6 flex justify-end items-center">
          {error && <p className="text-red-500 mr-4">{error}</p>}
          <button
            onClick={handleSendOffer}
            disabled={isSending}
            className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 flex items-center gap-2"
          >
            <Send size={18} />
            {isSending ? 'Đang gửi...' : 'Gửi Lời Chào'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}