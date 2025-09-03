// src/components/BentoGrid.tsx
"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaAngular, FaReact, FaGithub } from 'react-icons/fa';
import { SiNextdotjs, SiDocker } from 'react-icons/si';

// Dữ liệu cho các ô, bạn có thể tùy chỉnh
const bentoItems = [
  {
    gridSpan: 'col-span-2 md:col-span-2',
    title: 'Lập trình viên Frontend',
    description: 'Thành thạo Angular & React, chuyên xây dựng giao diện thân thiện và hiệu quả.',
    bgColor: 'bg-blue-100 dark:bg-blue-900/50',
    content: <div className="text-5xl text-blue-500 flex space-x-4"><FaAngular /><FaReact /></div>,
  },
  {
    gridSpan: 'col-span-2 md:col-span-1',
    title: 'Dự án Econtract',
    description: 'Tham gia phát triển tại Mobifone IT.',
    bgColor: 'bg-green-100 dark:bg-green-900/50',
    link: '/projects/mobifone-econtract', // <-- Sẽ tạo slug này sau
  },
  {
    gridSpan: 'col-span-2 md:col-span-1',
    title: 'GitHub',
    description: '@minh4doin1',
    bgColor: 'bg-gray-200 dark:bg-gray-700/50',
    content: <div className="text-5xl text-gray-800 dark:text-gray-200"><FaGithub /></div>,
    link: 'https://github.com/minh4doin1',
  },
  {
    gridSpan: 'col-span-2 md:col-span-1',
    title: 'Kinh nghiệm Fullstack',
    description: 'Sử dụng Next.js, NodeJS, Docker.',
    bgColor: 'bg-purple-100 dark:bg-purple-900/50',
    content: <div className="text-5xl text-purple-500 flex space-x-4"><SiNextdotjs /><SiDocker /></div>,
  },
  {
    gridSpan: 'col-span-2 md:col-span-2',
    title: 'Học viện CNBCVT',
    description: 'Tốt nghiệp loại Khá, chuyên ngành CNTT. Đạt học bổng KKHT 2021-2022.',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
  },
];

const BentoGrid = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {bentoItems.map((item, index) => (
          <motion.div
            key={index}
            className={`${item.gridSpan} ${item.bgColor} p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div>
              {item.content && <div className="mb-4">{item.content}</div>}
              <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            {item.link && (
              <Link href={item.link} className="mt-4 text-blue-600 font-semibold self-start hover:underline">
                Xem thêm &rarr;
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;