"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Stagger delay stays short (30-80ms) so lists don't feel slow to reveal.
const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

// Never animate from scale(0)/opacity from nothing that reads as broken —
// start from a barely-offset, mostly-visible state.
const item = {
  hidden: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
  show: {
    opacity: 1,
    transform: "translateY(0px) scale(1)",
    transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
};

export function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
