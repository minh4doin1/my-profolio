// src/lib/hooks/useKonamiCode.ts
import { useEffect, useState, useCallback } from 'react';

const konamiCode = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export const useKonamiCode = (callback: () => void) => {
  const [keys, setKeys] = useState<string[]>([]);

  const handler = useCallback(({ key }: KeyboardEvent) => {
    const newKeys = [...keys, key];
    
    // Chỉ giữ lại 10 phím cuối cùng
    if (newKeys.length > konamiCode.length) {
      newKeys.shift();
    }

    if (newKeys.join('') === konamiCode.join('')) {
      callback();
      // Reset để có thể kích hoạt lại
      setKeys([]);
    } else {
      setKeys(newKeys);
    }
  }, [keys, callback]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handler]);
};