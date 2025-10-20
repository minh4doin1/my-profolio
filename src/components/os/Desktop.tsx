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

  const AboutContent = () => (
    <div>
      <h2 className="text-3xl font-bold mb-4">Nguyễn Công Nhật Minh</h2>
      <p className="text-lg">
        Áp dụng kiến thức và kỹ năng IT để tích lũy kinh nghiệm thực tế, không ngừng học hỏi công nghệ mới và phát triển kỹ năng làm việc nhóm, hướng tới trở thành một chuyên gia trong lĩnh vực phát triển phần mềm.
      </p>
    </div>
  );
const Desktop = () => {
  const router = useRouter();
  const { isMobile } = useDeviceDetection();
  const { windows, minimized, activeWindowId, openWindow, closeWindow, focusWindow, minimizeWindow, mobileApp, openMobileApp, closeMobileApp  } = useDesktopStore();
  const PdfViewer = ({ fileUrl, isMobile }: { fileUrl: string, isMobile: boolean }) => {
  // Nếu là mobile, hiển thị nút bấm thay vì nhúng trực tiếp
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="mb-4 text-lg">
          Trình xem PDF không được tối ưu cho di động.
        </p>
        <p className="mb-6 text-gray-400">
          Vui lòng mở CV trong một tab mới để có trải nghiệm tốt nhất.
        </p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Xem CV
        </a>
      </div>
    );
  }

  // Nếu là desktop, giữ nguyên thẻ <embed>
  return <embed src={fileUrl} type="application/pdf" className="w-full h-full" />;
};



const apps: Record<string, App> = {
  about: { id: 'about', title: 'About Me', content: <AboutContent />, pageUrl: '/about' },
  projects: { id: 'projects', title: 'Projects', content: <FileExplorer />, pageUrl: '/projects' },
  cv: { id: 'cv', title: 'CV.pdf', content: <PdfViewer fileUrl="/CV_NguyenCongNhatMinh.pdf" isMobile={isMobile} /> },
  github: { id: 'github', title: 'GitHub Stats', content: <GitHubStats /> },
  blog: { id: 'blog', title: 'Code.log', content: <BlogApp />, pageUrl: '/blog' },
  guestbook: { id: 'guestbook', title: 'Guestbook', content: <GuestbookApp /> },
};
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