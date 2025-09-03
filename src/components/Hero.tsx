// src/components/Hero.tsx
"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section 
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl font-bold mb-4">
        Nguyễn Công Nhật Minh
      </h1>
      <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
        Một Web Developer đam mê xây dựng những ứng dụng web hiện đại và hữu ích.
      </h2>
      <div className="flex justify-center items-center space-x-4"> {/* <-- Sửa ở đây */}
        <Link 
          href="/projects" 
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105"
        >
          Xem dự án
        </Link>
        <Link 
          href="/contact" 
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform hover:scale-105"
        >
          Liên hệ
        </Link>
      </div>
    </motion.section>
  );
};

export default Hero;