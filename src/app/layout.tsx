"use client";
import { Inter } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';
import Taskbar from '@/components/os/Taskbar';
import { useDesktopStore, App } from '@/store/useDesktopStore';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const apps: Record<string, App> = {
  about: { id: 'about', title: 'About Me', content: <div/> },
  projects: { id: 'projects', title: 'Projects', content: <div/> },
  cv: { id: 'cv', title: 'CV.pdf', action: () => {} },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { windows, minimized, activeWindowId, openWindow, focusWindow } = useDesktopStore();

  const handleTaskbarClick = (id: string) => {
    focusWindow(id);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleStartMenuClick = (id: string) => {
    openWindow(apps[id]);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-900 overflow-hidden`}>
        <div className="w-screen h-screen clean-wallpaper">
          <main className="w-full h-[calc(100%-3rem)]">
            {children}
          </main>
          <Taskbar
            apps={apps}
            openWindows={windows}
            minimizedWindows={minimized}
            onTaskbarClick={handleTaskbarClick}
            onStartMenuClick={handleStartMenuClick}
            activeWindowId={activeWindowId}
          />
        </div>
      </body>
    </html>
  );
}