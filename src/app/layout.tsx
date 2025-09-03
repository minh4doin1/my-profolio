// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Import Navbar và Footer
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tên Của Bạn - Web Developer',
  description: 'Portfolio được xây dựng bằng các công nghệ web hiện đại nhất!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar /> {/* <-- Navbar sẽ luôn ở trên cùng */}
          
          {/* Phần main sẽ co dãn để lấp đầy không gian */}
          <main className="flex-grow container mx-auto p-4">
            {children} {/* <-- {children} là nơi nội dung của từng trang sẽ được hiển thị */}
          </main>
          
          <Footer /> {/* <-- Footer sẽ luôn ở dưới cùng */}
        </div>
      </body>
    </html>
  );
}