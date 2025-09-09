// src/components/os/StartMenu.tsx
"use client";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';

type AppInfo = {
  id: string;
  title: string;
  icon: string;
};

type StartMenuProps = {
  apps: Record<string, AppInfo>;
  onAppClick: (appId: string) => void;
  onClose: () => void;
};

const StartMenu = ({ apps, onAppClick, onClose }: StartMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef as React.RefObject<HTMLElement>, onClose);

  return (
    <motion.div
      ref={menuRef}
      className="absolute bottom-14 left-4 w-64 bg-gray-800/80 backdrop-blur-lg rounded-lg border border-gray-700 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="p-2">
        {Object.values(apps).map(app => (
          <button
            key={app.id}
            onClick={() => {
              onAppClick(app.id);
              onClose();
            }}
            className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-blue-500/30 text-white text-left"
          >
            <Image src={app.icon} alt={app.title} width={24} height={24} />
            <span>{app.title}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default StartMenu;