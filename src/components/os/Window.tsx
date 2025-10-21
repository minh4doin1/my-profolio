"use client";
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

type WindowProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  isActive: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: () => void;
};

const Window = ({ id, title, children, zIndex, isActive, onClose, onFocus, onMinimize, onMaximize }: WindowProps) => {
  return (
    <Rnd
      data-tour-id="window-main"
      default={{
        x: Math.max(0, window.innerWidth / 2 - 300),
        y: Math.max(0, window.innerHeight / 2 - 225),
        width: 600,
        height: 450,
      }}
      minWidth={320}
      minHeight={250}
      bounds="parent"
      className="pointer-events-auto"
      style={{ zIndex }}
      onDragStart={() => onFocus(id)}
      onMouseDown={() => onFocus(id)}
      dragHandleClassName="drag-handle"
      as={motion.div}
      layoutId={`window-${id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className={`drag-handle h-8 flex items-center justify-between px-2 rounded-t-lg cursor-move flex-shrink-0`}>
        <span className="font-bold text-sm text-white select-none">{title}</span>
        <div data-tour-id="window-controls" className="flex items-center space-x-1">
          <button onClick={() => onMinimize(id)} className="control-btn hover:bg-gray-600"><Minus size={12} /></button>
          <button onClick={onMaximize} className="control-btn hover:bg-gray-600"><Maximize size={12} /></button>
          <button onClick={() => onClose(id)} className="control-btn hover:bg-red-500"><X size={14} /></button>
        </div>
      </div>
      <div className="p-4 flex-grow overflow-y-auto text-white">
        {children}
      </div>
    </Rnd>
  );
};

export default Window;