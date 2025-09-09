"use client";
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-900 overflow-hidden`}>
        <div className="w-screen h-screen clean-wallpaper">
          <main className="w-full h-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}