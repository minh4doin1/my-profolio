// src/app/street-hustle/[roomCode]/OffersDashboard.tsx
"use client";

import { supabase } from '@/lib/supabase';
import { Check, X, Hourglass, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ... Type definitions ...
type Offer = {
  id: string;
  from_player_id: string;
  to_player_id: string;
  offer_details: {
    from?: { gold?: number };
    to?: { gold?: number };
  };
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  from_player_nickname?: string;
  to_player_nickname?: string;
}


// SỬA LỖI 1: Thêm roomCode vào props
interface OffersDashboardProps {
  offers: Offer[];
  myPlayerId: string;
  currentUserId: string;
  roomCode: string; // Thêm dòng này
}

export default function OffersDashboard({ offers, myPlayerId, currentUserId, roomCode }: OffersDashboardProps) {
  const incomingOffers = offers.filter(o => o.to_player_id === myPlayerId && o.status === 'pending');
  const outgoingOffers = offers.filter(o => o.from_player_id === myPlayerId && o.status === 'pending');

  const handleResponse = async (offerId: string, response: 'accepted' | 'declined') => {
    try {
      // SỬA LỖI 2: Thêm roomCode vào body của request
      await supabase.functions.invoke('respond-to-offer', {
        body: { offerId, response, userId: currentUserId, roomCode } // Thêm roomCode ở đây
      });
    } catch (error) {
      console.error(`Failed to respond to offer:`, error);
    }
  };

  // ... phần render giữ nguyên ...
  const renderOfferDetails = (details: Offer['offer_details'], fromNick: string, toNick: string) => {
    const fromItems = details.from?.gold ? `${details.from.gold} Vàng` : '...';
    const toItems = details.to?.gold ? `${details.to.gold} Vàng` : '...';
    return (
      <div className="flex items-center justify-center text-xs gap-2">
        <span className="font-semibold text-blue-300">{fromNick}</span>
        <span>{fromItems}</span>
        <ArrowRightLeft size={14} className="text-gray-400" />
        <span>{toItems}</span>
        <span className="font-semibold text-green-300">{toNick}</span>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-600 shadow-lg z-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lời mời nhận được */}
        <div>
          <h3 className="font-bold text-center text-lg mb-2">Lời mời nhận được</h3>
          <div className="space-y-2 h-32 overflow-y-auto pr-2">
            <AnimatePresence>
              {incomingOffers.length > 0 ? incomingOffers.map(offer => (
                <motion.div 
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gray-700 p-2 rounded flex justify-between items-center"
                >
                  {renderOfferDetails(offer.offer_details, offer.from_player_nickname!, offer.to_player_nickname!)}
                  <div className="flex gap-1">
                    <button onClick={() => handleResponse(offer.id, 'accepted')} className="p-2 bg-green-600 rounded hover:bg-green-500 transition-colors"><Check size={16} /></button>
                    <button onClick={() => handleResponse(offer.id, 'declined')} className="p-2 bg-red-600 rounded hover:bg-red-500 transition-colors"><X size={16} /></button>
                  </div>
                </motion.div>
              )) : (
                <p className="text-sm text-gray-500 text-center italic pt-4">Không có lời mời nào</p>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Lời mời đã gửi */}
        <div>
          <h3 className="font-bold text-center text-lg mb-2">Lời mời đã gửi</h3>
          <div className="space-y-2 h-32 overflow-y-auto pr-2">
            <AnimatePresence>
              {outgoingOffers.length > 0 ? outgoingOffers.map(offer => (
                <motion.div 
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gray-700 p-2 rounded flex justify-between items-center"
                >
                  {renderOfferDetails(offer.offer_details, offer.from_player_nickname!, offer.to_player_nickname!)}
                  <Hourglass size={16} className="text-yellow-400 animate-pulse" />
                </motion.div>
              )) : (
                <p className="text-sm text-gray-500 text-center italic pt-4">Chưa gửi lời mời nào</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}