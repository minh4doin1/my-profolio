// src/components/HackerIntro.tsx
"use client";
import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

type HackerIntroProps = {
  onAnimationComplete: () => void;
};

// --- ĐỊNH NGHĨA CÁC ĐOẠN TEXT ---
const postSequenceText = 'PTIT BIOS v1.0.2024\nCPU: Intel(R) Core(TM) i-Dev @ 4.00GHz\nMemory Test: 16384M OK\n\nInitializing NCM Portfolio OS...';
const profileCommandText = '\n\nroot@ncm-portfolio:~# ./load-profile.sh';
const profileBoxText = `\n+------------------------------------------------------+\n| PROFILE: NGUYEN CONG NHAT MINH                       |\n+------------------------------------------------------+\n|                                                      |\n|   TITLE    : Frontend Developer                      |\n|   LOCATION : Hanoi, Vietnam                          |\n|   STATUS   : Seeking new opportunities               |\n|   CONTACT  : minh2002811@gmail.com                   |\n|                                                      |\n+------------------------------------------------------+`;
const compileText = `\n\n[COMPILING] src/projects/Mobifone_Econtract.ts ... SUCCESS\n[COMPILING] src/projects/Mobifone_EasyConnect.ts ... SUCCESS\n[COMPILING] src/projects/IoT_Security_Device.c ... SUCCESS\n\n[COMPILING] src/skills/Angular.module.ts ... LOADED\n[COMPILING] src/skills/React.component.jsx ... LOADED\n[COMPILING] src/skills/NextJS.server.ts ... LOADED\n\nAll modules compiled successfully.\nGUI is ready to be launched.`;
const finalCommandText = '\n\nroot@ncm-portfolio:~# startx';

const HackerIntro = ({ onAnimationComplete }: HackerIntroProps) => {
  const [step, setStep] = useState(0);
  const [startTransition, setStartTransition] = useState(false);

  // Lắng nghe sự kiện nhấn phím Enter
  useEffect(() => {
    if (step < 4) return; // Chỉ lắng nghe khi đã gõ xong hết

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        setStartTransition(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);


  const TypingStep = ({ text, delay, nextStep }: { text: string, delay: number, nextStep: () => void }) => (
    <TypeAnimation sequence={[text, delay, nextStep]} speed={90} cursor={true} />
  );

  return (
    <motion.div
      className="fixed inset-0 bg-black text-green-400 p-4 sm:p-8 z-50 overflow-y-auto"
      style={{ fontFamily: "'Special Elite', monospace" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: startTransition ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={startTransition ? onAnimationComplete : undefined}
    >
      <div className="absolute inset-0 bg-black opacity-20 scanlines"></div>
      
      <pre className="whitespace-pre-wrap">
        {/* Giai đoạn 0: POST */}
        {step > 0 ? <div>{postSequenceText}</div> : <TypingStep text={postSequenceText} delay={1000} nextStep={() => setStep(1)} />}

        {/* Giai đoạn 1: Profile */}
        {step > 1 && <div>{profileCommandText}{profileBoxText}</div>}
        {step === 1 && <TypingStep text={`${profileCommandText}${profileBoxText}`} delay={2000} nextStep={() => setStep(2)} />}

        {/* Giai đoạn 2: Compile */}
        {step > 2 && <div>{compileText}</div>}
        {step === 2 && <TypingStep text={compileText} delay={1500} nextStep={() => setStep(3)} />}

        {/* Giai đoạn 3: Final Prompt */}
        {step > 3 && <div>{finalCommandText}<span className="blinking-cursor">█</span></div>}
        {step === 3 && <TypingStep text={finalCommandText} delay={500} nextStep={() => setStep(4)} />}
      </pre>

      {/* Hint text chỉ xuất hiện ở bước cuối cùng */}
      {step === 4 && (
        <motion.div
          className="mt-8 text-center text-xl" // Tăng kích thước chữ
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-white">Giao diện đồ họa đã sẵn sàng.</p>
          <p className="text-yellow-400 animate-pulse mt-2">Nhấn [Enter] để khởi chạy.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HackerIntro;