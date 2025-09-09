"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';

type MaximizedWindowLayoutProps = {
  windowId: string;
  title: string;
  children: React.ReactNode;
};

const MaximizedWindowLayout = ({ windowId, title, children }: MaximizedWindowLayoutProps) => {
  return (
    <motion.div
      layoutId={`window-${windowId}`}
      className="w-full h-full bg-gray-800 text-white flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-8 bg-gray-700 flex items-center justify-between px-4 flex-shrink-0">
        <h1 className="font-bold text-sm select-none">{title}</h1>
        <Link href="/" className="control-btn hover:bg-red-500" title="Close (Go to Desktop)">
          <X size={14} />
        </Link>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {children}
      </div>
    </motion.div>
  );
};

export default MaximizedWindowLayout;