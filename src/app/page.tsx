"use client";
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import HackerIntro from '@/components/HackerIntro'; // <-- Import

export default function Home() {
    const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã xem intro trong session này chưa
    const hasSeenIntro = sessionStorage.getItem('introSeen');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('introSeen', 'true');
  };

  if (showIntro) {
    return <HackerIntro onAnimationComplete={handleIntroComplete} />;
  }
  return (
    // Chúng ta không cần thẻ <main> ở đây nữa vì đã có trong layout.tsx
    // Sử dụng Fragment <>...</> để bao bọc các component
    <>
      <Hero />
      <BentoGrid />
      {/* Các section khác của trang chủ sẽ được thêm vào đây sau */}
    </>
  );
}