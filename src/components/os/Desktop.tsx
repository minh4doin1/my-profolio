"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';

import Window from './Window';
import Icon from './Icon';
import Taskbar from './Taskbar';
import FileExplorer from './FileExplorer';

type WindowApp = { id: string; title: string; content: React.ReactNode; pageUrl?: string; action?: never; };
type ActionApp = { id: string; title: string; content?: never; action: () => void; };
type App = WindowApp | ActionApp;
type OpenWindow = WindowApp & { zIndex: number; };

// --- Nội dung Cửa sổ ---
const AboutContent = () => (
  <div>
    <h2 className="text-3xl font-bold mb-4">Nguyễn Công Nhật Minh</h2>
    <p className="text-lg">
      Áp dụng kiến thức và kỹ năng IT để tích lũy kinh nghiệm thực tế, không ngừng học hỏi công nghệ mới và phát triển kỹ năng làm việc nhóm, hướng tới trở thành một chuyên gia trong lĩnh vực phát triển phần mềm.
    </p>
  </div>
);

// --- Định nghĩa Apps ---
const apps: Record<string, App> = {
  about: { id: 'about', title: 'About Me', content: <AboutContent />, pageUrl: '/about' },
  projects: { id: 'projects', title: 'Projects', content: <FileExplorer />, pageUrl: '/projects' },
  cv: { id: 'cv', title: 'CV.pdf', action: () => window.open('/CV_NguyenCongNhatMinh.pdf', '_blank') },
};

const Desktop = () => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [minimized, setMinimized] = useState<string[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [mobileAppOpen, setMobileAppOpen] = useState<OpenWindow | null>(null);

  const openWindow = (appId: keyof typeof apps) => {
    const app = apps[appId];
    if (app.action) { app.action(); return; }
    if (minimized.includes(app.id)) { focusWindow(app.id); return; }
    if (windows.find(w => w.id === app.id)) { focusWindow(app.id); return; }
    if (app.content) {
      const newWindow = { ...app, zIndex: nextZIndex };
      setWindows(prev => [...prev, newWindow]);
      setActiveWindowId(app.id);
      setNextZIndex(prev => prev + 1);
    }
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remainingWindows = windows.filter(w => w.id !== id);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const focusWindow = (id: string) => {
    if (minimized.includes(id)) {
      setMinimized(prev => prev.filter(mId => mId !== id));
    }
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setActiveWindowId(id);
    setNextZIndex(prev => prev + 1);
  };

  const minimizeWindow = (id: string) => {
    setMinimized(prev => [...new Set([...prev, id])]);
    if (activeWindowId === id) {
      const otherWindows = windows.filter(w => w.id !== id && !minimized.includes(w.id));
      setActiveWindowId(otherWindows.length > 0 ? otherWindows[otherWindows.length - 1].id : null);
    }
  };

  const handleMaximize = (pageUrl: string | undefined) => {
    if (pageUrl) router.push(pageUrl);
  };

  const handleMobileAppOpen = (appId: keyof typeof apps) => {
    const app = apps[appId];
    if (app.action) { app.action(); return; }
    if (app.content) {
      setMobileAppOpen({ ...app, zIndex: 1 });
    }
  };

  if (isMobile) {
    return (
      <div className="w-full h-full relative clean-wallpaper">
        <AnimatePresence>
          {mobileAppOpen && (
            <motion.div
              key={mobileAppOpen.id}
              className="absolute inset-0 bg-gray-800 z-20 p-4 flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ ease: 'easeInOut', duration: 0.4 }}
            >
              <div className="flex-grow overflow-y-auto text-white">{mobileAppOpen.content}</div>
              <button onClick={() => setMobileAppOpen(null)} className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg flex-shrink-0">Close</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-4 grid grid-cols-4 gap-4">
          {Object.values(apps).map(app => (
            <Icon key={app.id} id={app.id} name={app.title} tooltip={app.title} onDoubleClick={() => handleMobileAppOpen(app.id as keyof typeof apps)} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="p-4 flex flex-col flex-wrap h-full content-start">
          {Object.values(apps).map(app => (
            <Icon
              key={app.id}
              id={app.id}
              name={app.title}
              tooltip={app.title}
              onDoubleClick={() => openWindow(app.id as keyof typeof apps)}
            />
          ))}
        </div>
        {windows.filter(win => !minimized.includes(win.id)).map(win => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            zIndex={win.zIndex}
            isActive={win.id === activeWindowId}
            onClose={closeWindow}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={() => handleMaximize(win.pageUrl)}
          >
            {win.content}
          </Window>
        ))}
      </div>
      
      <Taskbar
        apps={apps}
        openWindows={windows}
        minimizedWindows={minimized}
        onTaskbarClick={focusWindow}
        onStartMenuClick={(id) => openWindow(id as keyof typeof apps)}
        activeWindowId={activeWindowId}
      />
    </div>
  );
};

export default Desktop;