// src/app/page.tsx
"use client";
import { useState, useEffect } from 'react';
import HackerIntro from '@/components/HackerIntro';
import Desktop from '@/components/os/Desktop';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Kiểm tra sessionStorage để xem intro đã được xem trong phiên này chưa
    const hasSeenIntro = sessionStorage.getItem('introSeen');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Đánh dấu là đã xem intro
    sessionStorage.setItem('introSeen', 'true');
  };

  return (
    <div>
      {showIntro && <HackerIntro onAnimationComplete={handleIntroComplete} />}
      {!showIntro && <Desktop />}
    </div>
  );
}