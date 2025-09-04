"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FileExplorer from '@/components/os/FileExplorer';

export default function ProjectsPage() {
  return (
    // Bọc toàn bộ trang bằng motion.div với layoutId
    <motion.div 
      layoutId="window-projects"
      className="absolute inset-0 bg-gray-800 text-white flex flex-col"
    >
      {/* Title Bar giả lập */}
      <div className="h-8 bg-gray-700 flex items-center justify-between px-4">
        <h1 className="font-bold text-sm">Projects</h1>
        <Link href="/" className="text-gray-300 hover:text-white">
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Nội dung trang */}
      <div className="flex-grow p-4 overflow-y-auto">
        <FileExplorer />
      </div>
    </motion.div>
  );
}