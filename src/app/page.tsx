// src/app/page.tsx
import Hero from '@/components/Hero';
import TechStack from '@/components/TechStack';

export default function Home() {
  return (
    // Chúng ta không cần thẻ <main> ở đây nữa vì đã có trong layout.tsx
    // Sử dụng Fragment <>...</> để bao bọc các component
    <>
      <Hero />
      <TechStack />
      {/* Các section khác của trang chủ sẽ được thêm vào đây sau */}
    </>
  );
}