import { motion } from "framer-motion";
import { ReactNode } from "react";

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="mobile-container"
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PressableButton = ({ children, className = "", onClick, disabled }: { children: ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={className}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

export const AnimatedCounter = ({ value, duration = 1.2 }: { value: number; duration?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <CounterInner value={value} duration={duration} />
    </motion.span>
  );
};

import { useEffect, useState } from "react";

const CounterInner = ({ value, duration }: { value: number; duration: number }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display}</>;
};

export const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-skeleton rounded-lg bg-muted ${className}`} />
);
