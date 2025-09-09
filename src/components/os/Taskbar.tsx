"use client";
import { useState, useEffect, useRef } from 'react';
import { Home, FileText, Folder, FileType2 } from 'lucide-react';

type AppInfo = {
  id: string;
  title: string;
};

type TaskbarProps = {
  apps: Record<string, AppInfo>;
  openWindows: AppInfo[];
  minimizedWindows: string[];
  onTaskbarClick: (id: string) => void;
  onStartMenuClick: (id: string) => void;
  activeWindowId: string | null;
};

const renderAppIcon = (appId: string) => {
  switch (appId) {
    case 'about':
      return <FileText size={20} className="text-gray-300" />;
    case 'projects':
      return <Folder size={20} className="text-yellow-400" />;
    case 'cv':
      return <FileType2 size={20} className="text-red-400" />;
    default:
      return null;
  }
};

const Taskbar = ({ apps, openWindows, minimizedWindows, onTaskbarClick, onStartMenuClick, activeWindowId }: TaskbarProps) => {
  const [time, setTime] = useState('');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setIsStartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/70 backdrop-blur-lg flex items-center justify-between px-2 border-t border-gray-700 z-[9999]">
      <div className="flex items-center space-x-2">
        <div className="relative" ref={startMenuRef}>
          <button
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className="w-10 h-10 bg-blue-500 rounded-md font-bold text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
            title="Start"
          >
            <Home size={20} />
          </button>
          {isStartMenuOpen && (
            <div className="absolute bottom-full mb-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2">
              {Object.values(apps).map(app => (
                <button
                  key={app.id}
                  onClick={() => {
                    onStartMenuClick(app.id);
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-blue-500/30 rounded-md text-left"
                >
                  {renderAppIcon(app.id)}
                  <span className="text-white">{app.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {openWindows.map(win => (
          <button
            key={win.id}
            onClick={() => onTaskbarClick(win.id)}
            className={`h-9 px-3 rounded-md flex items-center space-x-2 transition-all duration-200 border-b-2 ${win.id === activeWindowId && !minimizedWindows.includes(win.id) ? 'bg-blue-500/40 border-blue-400' : 'border-transparent hover:bg-white/10'}`}
            title={win.title}
          >
            {renderAppIcon(win.id)}
            <span className="hidden sm:inline text-white text-sm">{win.title}</span>
          </button>
        ))}
      </div>
      <div className="text-white text-sm font-semibold">
        {time}
      </div>
    </div>
  );
};

export default Taskbar;