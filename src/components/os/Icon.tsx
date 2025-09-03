// src/components/os/Icon.tsx
import Image from 'next/image';

type IconProps = {
  name: string;
  iconUrl: string;
  tooltip: string; // <-- Prop mới
  onDoubleClick: () => void;
};

const Icon = ({ name, iconUrl, tooltip, onDoubleClick }: IconProps) => {
  return (
    <div 
      onDoubleClick={onDoubleClick} 
      className="group relative flex flex-col items-center w-24 p-2 hover:bg-blue-500/20 rounded-md cursor-pointer select-none"
    >
      <Image 
        src={iconUrl} 
        alt={`${name} icon`} 
        width={48} 
        height={48}
        className="mb-1"
      />
      <span className="text-white text-sm text-center break-words">{name}</span>
      
      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default Icon;