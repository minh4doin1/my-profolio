"use client";
import { motion } from 'framer-motion';

type WelcomeGuideProps = {
  onStartTour: () => void;
  onDismiss: () => void;
};

const WelcomeGuide = ({ onStartTour, onDismiss }: WelcomeGuideProps) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl max-w-md text-center border border-gray-700"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Chào mừng đến Portfolio OS!</h2>
        <p className="text-gray-300 mb-8">
          Đây là một portfolio được thiết kế dưới dạng một hệ điều hành giả lập. Bạn có muốn xem một hướng dẫn nhanh không?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onStartTour}
            className="px-8 py-3 bg-blue-600 font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Bắt đầu
          </button>
          <button
            onClick={onDismiss}
            className="px-8 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Để sau
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeGuide;