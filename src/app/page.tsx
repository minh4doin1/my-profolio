// src/app/page.tsx
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';

export default function Home() {
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