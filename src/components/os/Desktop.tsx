"use client";
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useDesktopStore, App } from '@/store/useDesktopStore';

import Window from './Window';
import Icon from './Icon';
import FileExplorer from './FileExplorer';
import GitHubStats from './apps/GitHubStats';
import BlogApp from './apps/BlogApp';

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
};

const Desktop = () => {
  const router = useRouter();
  const { windows, minimized, activeWindowId, openWindow, closeWindow, focusWindow, minimizeWindow } = useDesktopStore();

  const handleMaximize = (pageUrl: string | undefined) => {
    if (pageUrl) router.push(pageUrl);
  };

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