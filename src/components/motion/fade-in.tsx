"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: "translateY(10px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{
        duration: 0.45,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
