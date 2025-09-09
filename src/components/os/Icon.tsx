"use client";
import { FileText, Folder, FileType2 } from 'lucide-react';

type IconProps = {
  id: string;
  name: string;
  tooltip: string;
  onDoubleClick: () => void;
};

const Icon = ({ id, name, tooltip, onDoubleClick }: IconProps) => {
  const renderIcon = () => {
    switch (id) {
      case 'about':
        return <FileText size={48} className="text-gray-300" />;
      case 'projects':
        return <Folder size={48} className="text-yellow-400" />;
      case 'cv':
        return <FileType2 size={48} className="text-red-400" />;
      default:
        return <div className="w-12 h-12 bg-gray-500"></div>;
    }
  };

  return (
    <div
      onDoubleClick={onDoubleClick}
      className="group relative flex flex-col items-center w-24 p-2 hover:bg-blue-500/20 rounded-md cursor-pointer select-none"
    >
      {renderIcon()}
      <span className="mt-1 text-white text-sm text-center break-words">{name}</span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default Icon;