// src/components/SpotlightEffect.tsx
"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

export function SpotlightEffect() {
  const mouseX = useMotionValue(0); // <-- Sửa let thành const
  const mouseY = useMotionValue(0); // <-- Sửa let thành const

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect(); // <-- Sửa let thành const
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-radial from-gray-100/20 to-transparent opacity-0 [background-size:150%_150%] group-hover:opacity-100 dark:from-gray-700/20"
        style={{
          backgroundPosition: useMotionTemplate`calc(${mouseX}px - 75%) calc(${mouseY}px - 75%)`,
        }}
      />
    </div>
  );
}