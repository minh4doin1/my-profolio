// src/components/os/Desktop.tsx

"use client";
import { useRouter } from 'next/navigation'; // Import useRouter
import { AnimatePresence, motion } from 'framer-motion';
import { useDeviceDetection } from '@/lib/hooks/useDeviceDetection';
import { useDesktopStore } from '@/store/useDesktopStore';
import { getApps } from '@/data/apps';

import Window from './Window';
import Icon from './Icon';

const Desktop = () => {
  const router = useRouter(); // Gọi hook ở đây
  const { isMobile } = useDeviceDetection();
  
  // Truyền router vào hàm getApps
  const apps = getApps(isMobile, router);

  const { 
    windows, minimized, activeWindowId, openWindow, closeWindow, focusWindow, minimizeWindow,
    mobileApp, openMobileApp, closeMobileApp 
  } = useDesktopStore();

  const handleMaximize = (pageUrl: string | undefined) => {
    if (pageUrl) router.push(pageUrl);
  };

  const handleMobileAppOpen = (appId: keyof typeof apps) => {
    const app = apps[appId];
    // Sửa lại logic để gọi action nếu có
    if (app.action) { 
      app.action(); 
      return; 
    }
    if (app.content) {
      openMobileApp(app);
    }
  };

  if (isMobile) {
    return (
      <div className="w-full h-full relative clean-wallpaper">
        <AnimatePresence>
          {mobileApp && (
            <motion.div
              key={mobileApp.id}
              className="absolute inset-0 bg-gray-800 z-20 p-4 flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ ease: 'easeInOut', duration: 0.4 }}
            >
              <div className="flex-grow overflow-y-auto text-white">{mobileApp.content}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <div data-tour-id="mobile-icons" className="p-4 grid grid-cols-4 gap-4">
          {Object.values(apps).map(app => (
            <Icon 
              key={app.id} 
              id={app.id} 
              name={app.title} 
              tooltip={app.title} 
              onClick={() => handleMobileAppOpen(app.id as keyof typeof apps)} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div data-tour-id="desktop-icons" className="p-4 flex flex-col flex-wrap h-full content-start">
        {Object.values(apps).map(app => (
          <Icon
            key={app.id}
            id={app.id}
            name={app.title}
            tooltip={app.title}
            onDoubleClick={() => openWindow(app)}
          />
        ))}
      </div>
      <AnimatePresence>
        {windows.filter(win => !minimized.includes(win.id)).map(win => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            zIndex={win.zIndex}
            isActive={win.id === activeWindowId}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => handleMaximize(win.pageUrl)}
          >
            {win.content}
          </Window>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Desktop;