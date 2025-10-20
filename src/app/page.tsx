"use client";
import { useState, useEffect, useMemo } from 'react';
import HackerIntro from '@/components/HackerIntro';
import Desktop from '@/components/os/Desktop';
import WelcomeGuide from '@/components/guides/WelcomeGuide';
import TourGuide, { TourStep } from '@/components/guides/TourGuide';
import { useDeviceDetection } from '@/lib/hooks/useDeviceDetection';
import { useDesktopStore, App } from '@/store/useDesktopStore';
import { getApps } from '@/data/apps';

// Hàm tạo các bước tour động
const generateTourSteps = (isMobile: boolean, openWindowAction: (app: App) => void): TourStep[] => {
  const apps = getApps(isMobile);

  // Tạo các bước hướng dẫn cho từng icon
  const iconSteps: TourStep[] = Object.values(apps).map(app => ({
    selector: `[data-tour-id="icon-${app.id}"]`,
    title: `Ứng dụng: ${app.title}`,
    content: app.description,
    position: isMobile ? 'bottom' : 'right',
  }));

  if (isMobile) {
    return [
      ...iconSteps,
      {
        selector: '[data-tour-id="mobile-home-btn"]',
        title: "Thanh điều hướng",
        content: "Sử dụng nút này để quay về màn hình chính hoặc đóng ứng dụng đang mở.",
        position: 'top',
      },
    ];
  }

  // Các bước cho PC
  return [
    {
      selector: '[data-tour-id="icon-about"]', // Bắt đầu với icon About Me
      title: `Ứng dụng: ${apps.about.title}`,
      content: apps.about.description,
      position: 'right',
    },
    {
      selector: 'body',
      title: "Mở ứng dụng",
      content: "Để tôi minh họa nhé. Tôi sẽ mở ứng dụng này cho bạn...",
      action: () => openWindowAction(apps.about),
    },
    {
      selector: '[data-tour-id="window-main"]',
      title: "Cửa sổ ứng dụng",
      content: "Bạn có thể kéo thả và thay đổi kích thước cửa sổ này.",
      position: 'bottom',
    },
    // Thêm các bước cho các icon còn lại, trừ icon 'about' đã giới thiệu
    ...iconSteps.filter(step => step.selector !== '[data-tour-id="icon-about"]'),
  ];
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const { isMobile } = useDeviceDetection();
  
  const openWindow = useDesktopStore((state) => state.openWindow);
  const closeWindow = useDesktopStore((state) => state.closeWindow);

  const tourSteps = useMemo(() => generateTourSteps(isMobile, openWindow), [isMobile, openWindow]);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('introSeen');
    if (hasSeenIntro) {
      setShowIntro(false);
      const hasSeenTour = localStorage.getItem('hasSeenTour');
      if (!hasSeenTour) {
        setTimeout(() => setShowWelcome(true), 500);
      }
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('introSeen', 'true');
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setShowWelcome(true), 500);
    }
  };

  const startTour = () => {
    setShowWelcome(false);
    setTourActive(true);
  };

  const dismissAllGuides = () => {
    setShowWelcome(false);
    setTourActive(false);
    localStorage.setItem('hasSeenTour', 'true');
    closeWindow('about'); // Đóng cửa sổ 'about' đã mở trong tour
  };

  return (
    <div className="w-full h-full">
      {showIntro && <HackerIntro onAnimationComplete={handleIntroComplete} />}
      {!showIntro && <Desktop />}

      {showWelcome && <WelcomeGuide onStartTour={startTour} onDismiss={dismissAllGuides} />}
      {tourActive && <TourGuide steps={tourSteps} onComplete={dismissAllGuides} />}
    </div>
  );
}