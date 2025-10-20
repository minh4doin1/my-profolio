"use client";
import { Home, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { App } from '@/store/useDesktopStore';

type MobileNavProps = {
  openApp: App | null;
  onCloseApp: () => void;
  onGoHome: () => void;
};

const MobileNav = ({ openApp, onCloseApp, onGoHome }: MobileNavProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/70 backdrop-blur-lg flex items-center justify-around px-2 border-t border-gray-700 z-[9999]">
      <button
        data-tour-id="mobile-home-btn"
        onClick={onGoHome}
        className="flex flex-col items-center justify-center text-white w-16 h-full"
      >
        <Home size={24} />
      </button>

      <AnimatePresence>
        {openApp && (
          <motion.button
            onClick={onCloseApp}
            className="flex flex-col items-center justify-center text-white w-16 h-full"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <X size={24} />
            <span className="text-xs">Close</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;