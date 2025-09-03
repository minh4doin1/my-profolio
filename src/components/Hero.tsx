// src/components/Hero.tsx
"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  const title = "Nguyễn Công Nhật Minh";
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08, // Khoảng cách thời gian giữa các chữ
      },
    },
  };
  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
<section className="text-center py-32 min-h-[80vh] flex flex-col justify-center items-center">
      <motion.h1
        className="text-5xl font-bold mb-4"
        variants={sentence}
        initial="hidden"
        animate="visible"
      >
        {title.split("").map((char, index) => (
          <motion.span key={char + "-" + index} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.h1>
      
      <motion.h2 
        className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        Lập trình viên đam mê xây dựng các sản phẩm phần mềm có giá trị cho cộng đồng.
      </motion.h2>
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
     </section>
  );
};

export default Hero;