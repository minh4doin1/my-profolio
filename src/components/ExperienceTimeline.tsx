// src/components/ExperienceTimeline.tsx
"use client";
import { motion } from 'framer-motion';

const experiences = [
  {
    date: '11/2024 - Nay',
    company: 'Mobifone IT',
    role: 'Lập trình viên Frontend',
    description: 'Tham gia dự án Econtract và EasyConnect, lập trình giao diện người dùng và xử lý logic nghiệp vụ.',
  },
  {
    date: '6/2024 - 8/2024',
    company: 'VNPT IT',
    role: 'Thực tập sinh Frontend (Angular)',
    description: 'Sử dụng Angular để xây dựng giao diện người dùng thân thiện và hiệu quả cho các ứng dụng web nội bộ.',
  },
  {
    date: '7/2023 - 11/2023',
    company: 'Viện Hàn lâm KH&KT Việt Nam',
    role: 'Thực tập sinh (Hệ thống nhúng)',
    description: 'Tham gia nghiên cứu khoa học, xuất bản bài báo về thiết bị IoT giám sát an toàn phòng máy tính.',
  },
];

const ExperienceTimeline = () => {
  return (
    <div className="relative">
      {/* Đường kẻ dọc */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          className="relative pl-12 mb-12"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          {/* Chấm tròn trên timeline */}
          <div className="absolute left-4 top-1 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2"></div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{exp.date}</p>
          <h3 className="text-xl font-bold">{exp.role}</h3>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{exp.company}</p>
          <p>{exp.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ExperienceTimeline;