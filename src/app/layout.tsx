// src/app/layout.tsx

// Bắt buộc phải có vì chúng ta sử dụng hooks (useState, useKonamiCode)
"use client"; 

import { useState } from 'react';
import { Inter } from 'next/font/google';

// Import các provider và component layout
import { ThemeProvider } from '@/components/ThemeProvider';
import TransitionProvider from '@/components/TransitionProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import các hiệu ứng và "trứng phục sinh"
import { SpotlightEffect } from '@/components/SpotlightEffect';
import { useKonamiCode } from '@/lib/hooks/useKonamiCode';
import Confetti from 'react-confetti';

// Import file CSS global
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Lưu ý: Vì đây là Client Component, chúng ta không thể export 'metadata' như trước.
// Việc quản lý title và description sẽ được thực hiện ở các file page.tsx con.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State để điều khiển việc hiển thị pháo hoa
  const [showConfetti, setShowConfetti] = useState(false);

  // Hàm callback được gọi khi người dùng nhập đúng Konami Code
  const triggerConfetti = () => {
    setShowConfetti(true);
    // Tự động tắt pháo hoa sau 5 giây để tiết kiệm tài nguyên
    setTimeout(() => setShowConfetti(false), 5000); 
  };

  // Kích hoạt hook để lắng nghe Konami Code
  useKonamiCode(triggerConfetti);

  return (
    // suppressHydrationWarning cần thiết cho thư viện next-themes (Dark Mode)
    <html lang="vi" suppressHydrationWarning>
      {/* Thêm class 'group/spotlight' để kích hoạt hiệu ứng spotlight */}
      <body className={`${inter.className} group/spotlight`}>
        
        {/* Hiển thị pháo hoa nếu state là true */}
        {showConfetti && <Confetti />}

        {/* ThemeProvider quản lý việc chuyển đổi Dark/Light mode */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          {/* Container chính của toàn bộ ứng dụng */}
          <div className="relative flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            
            {/* Component hiệu ứng Spotlight theo chuột */}
            <SpotlightEffect />
            
            <Navbar />
            
            <main className="flex-grow container mx-auto p-4">
              {/* TransitionProvider quản lý hiệu ứng chuyển trang */}
              <TransitionProvider>{children}</TransitionProvider>
            </main>
            
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}