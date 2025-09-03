// src/components/TransitionProvider.tsx
"use client"; // Bắt buộc phải có vì Framer Motion sử dụng các hook của client

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // Key là pathname để AnimatePresence biết khi nào trang thay đổi
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionProvider;