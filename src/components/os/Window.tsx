"use client";
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize } from 'lucide-react';

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
  const windowClasses = `
    shadow-2xl flex flex-col w-full h-full
    bg-gray-800/80 backdrop-blur-xl 
    border rounded-lg transition-colors duration-300
    ${isActive ? 'border-blue-400' : 'border-gray-600'}
  `;

  return (
    <Rnd
      default={{
        x: Math.max(0, window.innerWidth / 2 - 300),
        y: Math.max(0, window.innerHeight / 2 - 225),
        width: 600,
        height: 450,
      }}
      minWidth={320}
      minHeight={250}
      bounds="parent"
      className={windowClasses}
      style={{ zIndex }}
      onDragStart={() => onFocus(id)}
      onMouseDown={() => onFocus(id)}
      dragHandleClassName="drag-handle"
    >
      <div className={`drag-handle h-8 flex items-center justify-between px-2 rounded-t-lg cursor-move ${isActive ? 'bg-gray-700' : 'bg-gray-800'}`}>
        <span className="font-bold text-sm text-white select-none">{title}</span>
        <div className="flex items-center space-x-1">
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