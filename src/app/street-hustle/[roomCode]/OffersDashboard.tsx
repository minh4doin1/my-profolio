"use client";

import { supabase } from '@/lib/supabase';
import { Check, X, Hourglass, ArrowRightLeft, Coins, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Offer } from '@/store/useGameStore';

interface OffersDashboardProps {
  offers: Offer[];
  myPlayerId: string;
  currentUserId: string;
  roomCode: string;
}

// Component con để render chi tiết một phần của offer
const OfferItems = ({ items }: { items: Offer['offer_details']['from'] }) => {
  if (!items || Object.keys(items).length === 0) return <span className="italic text-gray-500">Không có gì</span>;
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {items.gold && <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md text-xs"><Coins size={12}/> {items.gold}</span>}
      {items.landIds && items.landIds.map(id => <span key={id} className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-md text-xs"><MapPin size={12}/> Sổ Đỏ</span>)}
      {items.businessTileIds && items.businessTileIds.map(id => <span key={id} className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-xs"><Building2 size={12}/> Kinh Doanh</span>)}
    </div>
  );
};

export default function OffersDashboard({ offers, myPlayerId, currentUserId, roomCode }: OffersDashboardProps) {
  const incomingOffers = offers.filter(o => o.to_player_id === myPlayerId && o.status === 'pending');
  const outgoingOffers = offers.filter(o => o.from_player_id === myPlayerId && o.status === 'pending');

  const handleResponse = async (offerId: string, response: 'accepted' | 'declined') => {
    try {
      await supabase.functions.invoke('respond-to-offer', {
        body: { offerId, response, userId: currentUserId, roomCode }
      });
    } catch (error) {
      console.error(`Failed to respond to offer:`, error);
    }
  };

  const renderOfferDetails = (offer: Offer) => {
    return (
      <div className="flex items-center justify-center text-xs gap-2 w-full">
        <div className="flex-1 text-right">
          <p className="font-semibold text-blue-300 mb-1">{offer.from_player_nickname}</p>
          <OfferItems items={offer.offer_details.from} />
        </div>
        <ArrowRightLeft size={16} className="text-gray-400 flex-shrink-0 mx-2" />
        <div className="flex-1 text-left">
          <p className="font-semibold text-green-300 mb-1">{offer.to_player_nickname}</p>
          <OfferItems items={offer.offer_details.to} />
        </div>
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
                  className="bg-gray-700 p-2 rounded flex justify-between items-center gap-2"
                >
                  {renderOfferDetails(offer)}
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
                  className="bg-gray-700 p-2 rounded flex justify-between items-center gap-2"
                >
                  {renderOfferDetails(offer)}
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