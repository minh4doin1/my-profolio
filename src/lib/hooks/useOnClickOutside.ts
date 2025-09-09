// src/lib/hooks/useOnClickOutside.ts
"use client";
import { RefObject, useEffect } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

// Một custom hook linh hoạt, chấp nhận một ref và một hàm xử lý
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Không làm gì nếu click vào chính phần tử ref hoặc các phần tử con của nó
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      // Gọi hàm xử lý nếu click ra ngoài
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Dọn dẹp listener khi component unmount
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Chạy lại effect nếu ref hoặc handler thay đổi
}