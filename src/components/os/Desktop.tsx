// src/components/os/Desktop.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import useRouter
import Window from './Window';
import Icon from './Icon';
import Taskbar from './Taskbar';
import { motion, AnimatePresence } from 'framer-motion';

// --- Định nghĩa Type (Thêm 'pageUrl' cho WindowApp) ---
type WindowApp = { 
  id: string; 
  title: string; 
  icon: string; 
  content: React.ReactNode; 
  pageUrl?: string; // <-- Thêm thuộc tính này
  action?: never; 
};
type ActionApp = { id: string; title: string; icon: string; content?: never; action: () => void; };
type App = WindowApp | ActionApp;
type OpenWindow = WindowApp & { zIndex: number; };

// --- Nội dung Cửa sổ ---
const AboutContent = () => (<div>Nội dung giới thiệu...</div>);
const ProjectsContent = () => (<div>Danh sách dự án...</div>);

// --- Định nghĩa Apps (Thêm 'pageUrl') ---
const apps: Record<string, App> = {
  about: { id: 'about', title: 'About_Me.txt', icon: '/icons/txt.png', content: <AboutContent />, pageUrl: '/about' },
  projects: { id: 'projects', title: 'Projects.exe', icon: '/icons/folder.png', content: <ProjectsContent />, pageUrl: '/projects' },
  cv: { id: 'cv', title: 'CV.pdf', icon: '/icons/pdf.png', action: () => window.open('/CV_NguyenCongNhatMinh.pdf', '_blank') },
};

const Desktop = () => {
  const router = useRouter(); // <-- Khởi tạo router
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [minimized, setMinimized] = useState<string[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);

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

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden relative wallpaper">
      {/* Desktop Icons */}
      <div className="p-4 flex flex-col flex-wrap h-full content-start">
        {Object.values(apps).map(app => (
          <Icon 
            key={app.id}
            name={app.title} 
            iconUrl={app.icon}
            tooltip={app.id === 'about' ? 'Giới thiệu bản thân và kinh nghiệm' : app.id === 'projects' ? 'Các dự án đã thực hiện' : 'Mở CV trong tab mới'}
            onDoubleClick={() => openWindow(app.id as keyof typeof apps)} 
          />
        ))}
      </div>

      {/* --- SỬA LỖI KHÔNG CLICK ĐƯỢC ICON --- */}
      {/* Wrapper cho các cửa sổ, không còn chặn sự kiện */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <AnimatePresence>
          {windows.filter(win => !minimized.includes(win.id)).map(win => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              // Thêm lại pointer-events-auto cho từng cửa sổ
              className="absolute top-0 left-0 w-full h-full pointer-events-auto"
            >
              <Window
                id={win.id}
                title={win.title}
                zIndex={win.zIndex}
                isActive={win.id === activeWindowId}
                onClose={closeWindow}
                onFocus={focusWindow}
                onMinimize={minimizeWindow}
                onMaximize={() => handleMaximize(win.pageUrl)} // <-- Truyền hàm xử lý
              >
                {win.content}
              </Window>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <Taskbar 
        openWindows={windows}
        minimizedWindows={minimized}
        onTaskbarClick={focusWindow}
        activeWindowId={activeWindowId}
      />
    </div>
  );
};

export default Desktop;