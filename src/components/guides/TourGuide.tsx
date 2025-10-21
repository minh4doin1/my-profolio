"use client";
import { useState, useEffect, useCallback, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type TourStep = {
  selector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
};

type TourGuideProps = {
  steps: TourStep[];
  onComplete: () => void;
};

const TourGuide = ({ steps, onComplete }: TourGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const handleNext = useCallback((skipAction = false) => {
    if (!skipAction) setTargetRect(null);
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onComplete();
  }, [currentStep, steps, onComplete]);

  useEffect(() => {
    const step = steps[currentStep];
    if (!step) return;

    if (step.action) step.action();

    // SỬA LỖI 2: Dùng requestAnimationFrame để chờ layout ổn định
    const timer = setTimeout(() => {
      // Yêu cầu trình duyệt chạy code này trước lần vẽ tiếp theo
      requestAnimationFrame(() => {
        const element = document.querySelector(step.selector);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        } else {
          console.warn(`TourGuide: Element not found for selector: "${step.selector}". Skipping step.`);
          handleNext(true);
        }
      });
    }, 250); // Giữ một khoảng chờ nhỏ để component mount

    return () => clearTimeout(timer);
  }, [currentStep, steps, handleNext]);

  // Effect để tour tự cập nhật vị trí khi resize (giữ nguyên)
  useEffect(() => {
    const recalculatePosition = () => {
      const step = steps[currentStep];
      if (!step || !targetRect) return;
      const element = document.querySelector(step.selector);
      if (element) setTargetRect(element.getBoundingClientRect());
    };
    window.addEventListener('resize', recalculatePosition);
    return () => window.removeEventListener('resize', recalculatePosition);
  }, [currentStep, steps, targetRect]);

  // ... (phần còn lại của component không thay đổi)
  if (!targetRect) return <div className="tour-overlay" />;
  
  const step = steps[currentStep];
  const position = step.position || 'bottom';
  const TOOLTIP_WIDTH = 288;
  const VIEWPORT_PADDING = 16;

  const tooltipStyles: CSSProperties = {
    width: `${TOOLTIP_WIDTH}px`,
    maxWidth: `calc(100vw - ${VIEWPORT_PADDING * 2}px)`,
    zIndex: 100004,
  };

  if (position === 'top' || position === 'bottom') {
    const idealLeft = targetRect.left + targetRect.width / 2 - TOOLTIP_WIDTH / 2;
    const clampedLeft = Math.max(
      VIEWPORT_PADDING,
      Math.min(idealLeft, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING)
    );
    tooltipStyles.left = `${clampedLeft}px`;
    tooltipStyles.transform = 'none';
    tooltipStyles.top = position === 'bottom' ? targetRect.bottom + 12 : 'auto';
    tooltipStyles.bottom = position === 'top' ? window.innerHeight - targetRect.top + 12 : 'auto';
  } else {
    tooltipStyles.left = position === 'right' ? targetRect.right + 12 : 'auto';
    tooltipStyles.right = position === 'left' ? window.innerWidth - targetRect.left + 12 : 'auto';
    tooltipStyles.top = targetRect.top + targetRect.height / 2;
    tooltipStyles.transform = 'translateY(-50%)';
  }

  return (
    <>
      <div className="tour-overlay" />
      <div
        className="tour-highlight"
        style={{
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          top: targetRect.top - 4,
          left: targetRect.left - 4,
        }}
      />
      <AnimatePresence>
        <motion.div
          key={currentStep}
          className="absolute bg-gray-800 text-white p-4 rounded-lg shadow-2xl border border-gray-700"
          style={tooltipStyles}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {/* ... nội dung tooltip ... */}
          <h3 className="font-bold text-lg mb-2 text-blue-400">{step.title}</h3>
          <p className="text-sm text-gray-300">{step.content}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-500">{currentStep + 1} / {steps.length}</span>
            <button onClick={() => handleNext()} className="px-4 py-1 bg-blue-600 text-sm rounded hover:bg-blue-700">
              {currentStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
            </button>
          </div>
          <button onClick={onComplete} className="absolute top-2 right-2 text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default TourGuide;