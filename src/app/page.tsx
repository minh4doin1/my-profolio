"use client";
import { useState, useEffect } from 'react';
import HackerIntro from '@/components/HackerIntro';
import Desktop from '@/components/os/Desktop';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('introSeen');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('introSeen', 'true');
  };

  return (
    <div className="w-full h-full">
      {showIntro && <HackerIntro onAnimationComplete={handleIntroComplete} />}
      {!showIntro && <Desktop />}
    </div>
  );
}