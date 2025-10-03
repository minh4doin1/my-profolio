"use client";
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore, App } from '@/store/useDesktopStore';
import { useDeviceDetection } from '@/lib/hooks/useDeviceDetection';

import Window from './Window';
import Icon from './Icon';
import FileExplorer from './FileExplorer';
import GitHubStats from './apps/GitHubStats';
import BlogApp from './apps/BlogApp';
import GuestbookApp from './apps/GuestbookApp';
import { useState } from 'react';

const AboutContent = () => (<div>Nội dung giới thiệu...</div>);
const PdfViewer = ({ fileUrl }: { fileUrl: string }) => (
  <iframe 
    src={fileUrl} 
    className="w-full h-full border-none" 
    title="PDF Viewer"
  ></iframe>
);



const apps: Record<string, App> = {
  about: { id: 'about', title: 'About Me', content: <AboutContent />, pageUrl: '/about' },
  projects: { id: 'projects', title: 'Projects', content: <FileExplorer />, pageUrl: '/projects' },
  cv: { id: 'cv', title: 'CV.pdf', content: <PdfViewer fileUrl="/CV_NguyenCongNhatMinh.pdf" /> },
  github: { id: 'github', title: 'GitHub Stats', content: <GitHubStats /> },
  blog: { id: 'blog', title: 'Code.log', content: <BlogApp />, pageUrl: '/blog' },
  guestbook: { id: 'guestbook', title: 'Guestbook', content: <GuestbookApp /> },
};
const Desktop = () => {
  const router = useRouter();
  const { windows, minimized, activeWindowId, openWindow, closeWindow, focusWindow, minimizeWindow, mobileApp, openMobileApp, closeMobileApp  } = useDesktopStore();
  const handleMaximize = (pageUrl: string | undefined) => {
    if (pageUrl) router.push(pageUrl);
  };
  const handleMobileAppOpen = (appId: keyof typeof apps) => {
    const app = apps[appId];
    if (app.action) { app.action(); return; }
    if (app.content) {
      openMobileApp(app);
    }
  };
  const { isMobile } = useDeviceDetection();
  if (isMobile) {
    return (
      <div className="w-full h-full relative clean-wallpaper">
        <AnimatePresence>
          {/* Dùng state mobileApp từ store */}
          {mobileApp && (
            <motion.div
              key={mobileApp.id}
              className="absolute inset-0 bg-gray-800 z-20 p-4 flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ ease: 'easeInOut', duration: 0.4 }}
            >
              {/* Nút close này có thể giữ lại hoặc bỏ đi tùy ý, vì đã có ở MobileNav */}
              <div className="flex-grow overflow-y-auto text-white">{mobileApp.content}</div>
              <button onClick={() => closeMobileApp()} className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg flex-shrink-0">Close</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-4 grid grid-cols-4 gap-4">
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
      <div className="p-4 flex flex-col flex-wrap h-full content-start">
        {Object.values(apps).map(app => (
          <Icon
            key={app.id}
            id={app.id}
            name={app.title}
            tooltip={app.title}
            onDoubleClick={() => openWindow(app)}
            // onClick={() => openWindow(app)}
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
            onClose={closeWindow}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
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