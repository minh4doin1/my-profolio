// src/app/street-hustle/[roomCode]/TradingModal.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Building2, Coins } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Type definitions
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

// Component con để hiển thị một tài sản có thể chọn
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AssetItem = ({ item, onSelect, isSelected, type }: { item: any, onSelect: () => void, isSelected: boolean, type: 'land' | 'tile' }) => {
  const formatName = () => {
    if (type === 'land') return `${String.fromCharCode(65 + item.x_coord)}${item.y_coord + 1}`;
    return item.tile_type.replace('_', ' ');
  };

  return (
    <button
      onClick={onSelect}
      className={`px-2 py-1 rounded text-sm capitalize border-2 transition-all ${
        isSelected ? 'bg-blue-500 border-blue-300' : 'bg-gray-700 border-gray-600 hover:border-gray-500'
      }`}
    >
      {formatName()}
    </button>
  );
};

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
  
  // State cho lời chào mời
  const [myGoldOffer, setMyGoldOffer] = useState(0);
  const [myLandOfferIds, setMyLandOfferIds] = useState<string[]>([]);
  const [myTileOfferIds, setMyTileOfferIds] = useState<string[]>([]);
  
  const [theirGoldOffer, setTheirGoldOffer] = useState(0);
  // Trong tương lai có thể thêm state để yêu cầu đất/thẻ của họ

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const otherPlayers = useMemo(() => players.filter(p => p.id !== myPlayerId), [players, myPlayerId]);

  const resetForm = () => {
    setSelectedPlayerId('');
    setMyGoldOffer(0);
    setMyLandOfferIds([]);
    setMyTileOfferIds([]);
    setTheirGoldOffer(0);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSendOffer = async () => {
    if (!selectedPlayerId) {
      setError('Vui lòng chọn người chơi để giao dịch.');
      return;
    }
    setIsSending(true);
    setError('');

    const offerDetails = {
      from: {
        ...(myGoldOffer > 0 && { gold: myGoldOffer }),
        ...(myLandOfferIds.length > 0 && { landIds: myLandOfferIds }),
        ...(myTileOfferIds.length > 0 && { businessTileIds: myTileOfferIds }),
      },
      to: {
        ...(theirGoldOffer > 0 && { gold: theirGoldOffer }),
      }
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
      
      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSending(false);
    }
  };

  const toggleSelection = (id: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(id)) {
      setList(list.filter(itemId => itemId !== id));
    } else {
      setList([...list, id]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-700 p-4">
              <h2 className="text-2xl font-bold">Bàn Đàm Phán</h2>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-700"><X /></button>
            </div>

            <div className="p-4 space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cột của bạn */}
                <div className="p-4 bg-gray-900/50 rounded space-y-3">
                  <h3 className="font-bold text-lg text-blue-400">Bạn đưa</h3>
                  <div>
                    <label className="flex items-center gap-2"><Coins size={16} /> Vàng:</label>
                    <input type="number" min="0" value={myGoldOffer} onChange={e => setMyGoldOffer(Math.max(0, Number(e.target.value)))} className="w-full p-1 bg-gray-700 rounded mt-1" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2"><MapPin size={16} /> Sổ Đỏ:</label>
                    <div className="flex flex-wrap gap-2 mt-1 p-2 bg-black/20 rounded min-h-[40px]">
                      {myLands.map(land => <AssetItem key={land.id} item={land} type="land" isSelected={myLandOfferIds.includes(land.id)} onSelect={() => toggleSelection(land.id, myLandOfferIds, setMyLandOfferIds)} />)}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2"><Building2 size={16} /> Kinh Doanh:</label>
                    <div className="flex flex-wrap gap-2 mt-1 p-2 bg-black/20 rounded min-h-[40px]">
                      {myBusinessTiles.map(tile => <AssetItem key={tile.id} item={tile} type="tile" isSelected={myTileOfferIds.includes(tile.id)} onSelect={() => toggleSelection(tile.id, myTileOfferIds, setMyTileOfferIds)} />)}
                    </div>
                  </div>
                </div>
                {/* Cột của họ */}
                <div className="p-4 bg-gray-900/50 rounded space-y-3">
                  <h3 className="font-bold text-lg text-green-400">Bạn nhận</h3>
                  <div>
                    <label className="flex items-center gap-2"><Coins size={16} /> Vàng:</label>
                    <input type="number" min="0" value={theirGoldOffer} onChange={e => setTheirGoldOffer(Math.max(0, Number(e.target.value)))} className="w-full p-1 bg-gray-700 rounded mt-1" />
                  </div>
                  {/* TODO: Thêm UI chọn Sổ Đỏ và Mảnh Ghép của họ */}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-end items-center">
              {error && <p className="text-red-500 mr-4 text-sm">{error}</p>}
              <button
                onClick={handleSendOffer}
                disabled={isSending || !selectedPlayerId}
                className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 flex items-center gap-2"
              >
                <Send size={18} />
                {isSending ? 'Đang gửi...' : 'Gửi Lời Chào'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}