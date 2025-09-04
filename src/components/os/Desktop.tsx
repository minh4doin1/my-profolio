// src/components/os/Desktop.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

import Window from './Window';
import Icon from './Icon';
import Taskbar from './Taskbar';
import FileExplorer from './FileExplorer';

// --- Định nghĩa Type & Apps ---
type WindowApp = { id: string; title: string; icon: string; content: React.ReactNode; pageUrl?: string; action?: never; };
type ActionApp = { id: string; title: string; icon: string; content?: never; action: () => void; };
type App = WindowApp | ActionApp;
type OpenWindow = WindowApp & { zIndex: number; };

const AboutContent = () => (<div>Nội dung giới thiệu...</div>);

const apps: Record<string, App> = {
  about: { id: 'about', title: 'About Me', icon: '/icons/txt.png', content: <AboutContent />, pageUrl: '/about' },
  projects: { id: 'projects', title: 'Projects', icon: '/icons/folder.png', content: <FileExplorer />, pageUrl: '/projects' },
  cv: { id: 'cv', title: 'CV.pdf', icon: '/icons/pdf.png', action: () => window.open('/CV_NguyenCongNhatMinh.pdf', '_blank') },
};

const Desktop = () => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [minimized, setMinimized] = useState<string[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  
  // State cho mobile view
  const [mobileAppOpen, setMobileAppOpen] = useState<OpenWindow | null>(null);

  // ... (Các hàm openWindow, closeWindow, focusWindow, minimizeWindow giữ nguyên như trước)
  const openWindow = (appId: keyof typeof apps) => {
    const app = apps[appId];
    if (app.action) { app.action(); return; }
    
    if (minimized.includes(app.id)) {
      focusWindow(app.id);
      return;
    }

    if (windows.find(w => w.id === app.id)) {
      focusWindow(app.id);
      return;
    }

    if (app.content) {
      const newWindow = { ...app, zIndex: nextZIndex };
      setWindows([...windows, newWindow]);
      setActiveWindowId(app.id);
      setNextZIndex(nextZIndex + 1);
    }
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remainingWindows = windows.filter(w => w.id !== id);
      if (remainingWindows.length > 0) {
        setActiveWindowId(remainingWindows[remainingWindows.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const focusWindow = (id: string) => {
    if (minimized.includes(id)) {
      setMinimized(minimized.filter(mId => mId !== id));
    }
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setActiveWindowId(id);
    setNextZIndex(nextZIndex + 1);
  };

  const minimizeWindow = (id: string) => {
    setMinimized(prev => [...new Set([...prev, id])]);
    if (activeWindowId === id) {
      const otherWindows = windows.filter(w => w.id !== id && !minimized.includes(w.id));
      setActiveWindowId(otherWindows.length > 0 ? otherWindows[otherWindows.length - 1].id : null);
    }
  };
//   const minimizeWindow = (id: string) =>

  const handleMaximize = (pageUrl: string | undefined) => {
    if (pageUrl) {
      router.push(pageUrl); // <-- Điều hướng đến trang riêng
    }
  };

  // --- Logic cho Mobile ---
  const handleMobileAppOpen = (appId: keyof typeof apps) => {
    const app = apps[appId];
    if (app.action) { app.action(); return; }
    if (app.content) {
      setMobileAppOpen({ ...app, zIndex: 1 });
    }
  };

  // --- RENDER ---
  if (isMobile) {
    return (
      <div className="w-screen h-screen bg-gray-900 overflow-hidden relative clean-wallpaper">
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
              <div className="flex-grow overflow-y-auto">{mobileAppOpen.content}</div>
              <button onClick={() => setMobileAppOpen(null)} className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg">Close</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Home Screen */}
        <div className="p-4 grid grid-cols-4 gap-4">
          {Object.values(apps).map(app => (
            <Icon key={app.id} name={app.title} iconUrl={app.icon} onDoubleClick={() => handleMobileAppOpen(app.id as keyof typeof apps)} tooltip={''} />
          ))}
        </div>
      </div>
    );
  }

  // --- Desktop View ---
  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden relative clean-wallpaper">
      {/* Desktop Icons */}
      <div className="p-4 flex flex-col flex-wrap h-full content-start">
        {Object.values(apps).map(app => (
          <Icon key={app.id} name={app.title} iconUrl={app.icon} onDoubleClick={() => openWindow(app.id as keyof typeof apps)} tooltip={''} />
        ))}
      </div>

      {/* Windows */}
      <div className="absolute top-0 left-0 w-full h-[calc(100%-3rem)] pointer-events-none">
        <AnimatePresence>
          {windows.filter(win => !minimized.includes(win.id)).map(win => (
            <motion.div
              key={win.id}
              className="absolute top-0 left-0 w-full h-full pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Window
                id={win.id} title={win.title} zIndex={win.zIndex} isActive={win.id === activeWindowId}
                onClose={closeWindow} onFocus={focusWindow} onMinimize={minimizeWindow}
                onMaximize={() => handleMaximize(win.pageUrl)}
              >
                {win.content}
              </Window>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <Taskbar openWindows={windows} minimizedWindows={minimized} onTaskbarClick={focusWindow} activeWindowId={activeWindowId} />
    </div>
  );
};

export default Desktop;