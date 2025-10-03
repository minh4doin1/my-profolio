"use client";
import { useState, useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery';

export const useDeviceDetection = (): { isMobile: boolean } => {
  const [isMobile, setIsMobile] = useState(false);
  const isMobileView = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Logic này chỉ chạy ở phía client sau khi component đã được mount
    // navigator và window chỉ tồn tại trên trình duyệt
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    // Một thiết bị được coi là "mobile" nếu nó hỗ trợ cảm ứng VÀ có viewport hẹp
    setIsMobile(isTouchDevice && isMobileView);

  }, [isMobileView]); // Chạy lại hiệu ứng khi kích thước viewport thay đổi

  return { isMobile };
};