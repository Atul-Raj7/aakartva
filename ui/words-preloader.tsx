"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface WordsPreloaderProps {
  /**
   * Words to cycle through during preloading.
   */
  words?: string[];
  /**
   * Time (ms) to show the first word. Default: 800ms
   */
  initialDelay?: number;
  /**
   * Time (ms) between each intermediate word. Default: 160ms
   */
  cycleSpeed?: number;
  /**
   * Time (ms) to linger on the final word before exit animation. Default: 350ms
   */
  finalDelay?: number;
  /**
   * Background color of the preloader screen and the curved transition.
   * Default: "#ffffff" (matching Skiper UI preview)
   */
  backgroundColor?: string;
  /**
   * Text color of the words. Default: "#141516"
   */
  textColor?: string;
  /**
   * Extra CSS class for the container.
   */
  className?: string;
  /**
   * Callback fired once the curtain slide-up animation is completely finished.
   */
  onComplete?: () => void;
  /**
   * Lock body scroll while the preloader is active. Default: true
   */
  lockScroll?: boolean;
  /**
   * Height in px of the downward Bézier curve when sliding up. Default: 300
   */
  curveHeight?: number;
  /**
   * Optional Dennis Snellenberg style accent dot. Default: false
   */
  showDot?: boolean;
  /**
   * Color of the accent dot. Default: "#3b82f6"
   */
  dotColor?: string;
}

export const DEFAULT_PRELOADER_WORDS: string[] = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olá",
  "やあ",
  "Hallå",
  "Guten tag",
  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ",
];

export function WordsPreloader({
  words = DEFAULT_PRELOADER_WORDS,
  initialDelay = 800,
  cycleSpeed = 160,
  finalDelay = 350,
  backgroundColor = "#ffffff",
  textColor = "#141516",
  className,
  onComplete,
  lockScroll = true,
  curveHeight = 300,
  showDot = false,
  dotColor = "#3b82f6",
}: WordsPreloaderProps) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Measure window dimensions safely on client
  useEffect(() => {
    const updateDimension = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimension();
    window.addEventListener("resize", updateDimension);
    return () => window.removeEventListener("resize", updateDimension);
  }, []);

  // Lock body scroll while active
  useEffect(() => {
    if (!lockScroll) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lockScroll]);

  // Word cycling sequence
  useEffect(() => {
    if (words.length === 0) return;

    if (index === words.length - 1) {
      // Reached final greeting word -> wait finalDelay then trigger exit
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
      }, finalDelay);
      return () => clearTimeout(exitTimer);
    }

    const currentDelay = index === 0 ? initialDelay : cycleSpeed;
    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, currentDelay);

    return () => clearTimeout(timer);
  }, [index, words.length, initialDelay, cycleSpeed, finalDelay]);

  // SVG curved paths
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${
    dimension.width / 2
  } ${dimension.height + curveHeight} 0 ${dimension.height} L0 0`;

  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${
    dimension.width / 2
  } ${dimension.height} 0 ${dimension.height} L0 0`;

  const slideUpVariants: Variants = {
    initial: {
      top: 0,
    },
    exit: {
      top: "-100vh",
      transition: {
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.1,
      },
    },
  };

  const curveVariants: Variants = {
    initial: {
      d: initialPath,
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      d: targetPath,
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.15,
      },
    },
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isLoading && (
        <motion.div
          variants={slideUpVariants}
          initial="initial"
          exit="exit"
          className={cn(
            "fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center pointer-events-auto",
            className
          )}
          style={{
            // While hydrating, show solid background to prevent FOUC
            backgroundColor: dimension.width > 0 ? "transparent" : backgroundColor,
          }}
        >
          {dimension.width > 0 && (
            <>
              {/* Words Container */}
              <motion.div
                initial={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.25, ease: "easeInOut" },
                }}
                className="relative z-10 flex items-center justify-center px-6"
              >
                <div className="relative flex items-center justify-center min-h-[5rem]">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="flex items-center text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight select-none"
                    style={{ color: textColor }}
                  >
                    <span>{words[index]}</span>
                    {showDot && (
                      <span
                        className="ml-2.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full inline-block"
                        style={{ backgroundColor: dotColor }}
                      />
                    )}
                  </motion.p>
                </div>
              </motion.div>

              {/* Liquid curved SVG background */}
              <svg
                className="absolute top-0 left-0 w-full pointer-events-none"
                style={{
                  height: `calc(100% + ${curveHeight}px)`,
                }}
              >
                <motion.path
                  variants={curveVariants}
                  initial="initial"
                  exit="exit"
                  fill={backgroundColor}
                />
              </svg>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Alias matching Skiper UI skiper8
export const Skiper8 = WordsPreloader;
export default WordsPreloader;
