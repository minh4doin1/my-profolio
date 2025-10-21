"use client";
import { Inter } from 'next/font/google';
import { SessionProvider } from "next-auth/react";
import Taskbar from '@/components/os/Taskbar';
import MobileNav from '@/components/os/apps/MobileNav';
import { useDesktopStore } from '@/store/useDesktopStore';
import { useRouter, usePathname } from 'next/navigation';
import { useDeviceDetection } from '@/lib/hooks/useDeviceDetection';
import { getApps } from '@/data/apps';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useDeviceDetection();
  const apps = getApps(isMobile);
  
  const { 
    windows, minimized, activeWindowId, openWindow, focusWindow,
    mobileApp, closeMobileApp 
  } = useDesktopStore();

  const handleTaskbarClick = (id: string) => {
    focusWindow(id);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleStartMenuAppClick = (id: string) => {
    openWindow(apps[id]);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleGoHome = () => {
    if (pathname !== '/') {
      router.push('/');
    }
    if (mobileApp) {
      closeMobileApp();
    }
  };

  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-900 overflow-hidden`}>
        <SessionProvider>
          <div className="w-screen h-screen clean-wallpaper">
            <main className="w-full h-[calc(100%-3rem)]">
              {children}
            </main>
            
            {isMobile ? (
              <MobileNav 
                openApp={mobileApp}
                onCloseApp={closeMobileApp}
                onGoHome={handleGoHome}
              />
            ) : (
              <div data-tour-id="taskbar">
                <Taskbar
                  apps={apps}
                  openWindows={windows}
                  minimizedWindows={minimized}
                  onTaskbarClick={handleTaskbarClick}
                  onStartMenuAppClick={handleStartMenuAppClick}
                  activeWindowId={activeWindowId}
                />
              </div>
            )}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}