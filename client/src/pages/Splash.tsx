import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PressableButton } from "@/components/PageTransition";
import { Shield } from "lucide-react";

const tagline = "Your family's safety net. Built while you still can.".split(" ");

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col items-center justify-center min-h-screen px-6 md:px-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, hsl(var(--secondary)), transparent 70%)', top: '-5%', right: '-10%' }}
          animate={{ y: [0, 30, 0], x: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)', bottom: '5%', left: '-15%' }}
          animate={{ y: [0, -25, 0], x: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent)), transparent 70%)', top: '40%', right: '5%' }}
          animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-secondary/30"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}

        {/* Shield outlines floating */}
        <motion.div
          className="absolute opacity-[0.04]"
          style={{ top: '15%', left: '8%' }}
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Shield size={80} className="text-secondary" />
        </motion.div>
        <motion.div
          className="absolute opacity-[0.03]"
          style={{ bottom: '20%', right: '10%' }}
          animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Shield size={120} className="text-primary" />
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-2xl bg-secondary/20 flex items-center justify-center">
          <Shield size={48} className="text-secondary" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] w-3 h-3">
            <svg viewBox="0 0 24 24" fill="none" className="text-destructive">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-4 text-foreground"
      >
        GriefOS
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mb-10 text-lg text-muted-foreground">
        {tagline.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.3 }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.4 }}
        className="w-full max-w-sm space-y-3"
      >
        <PressableButton
          className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg"
          onClick={() => navigate("/owner/onboarding")}
        >
          Set up my vault
        </PressableButton>
        <PressableButton
          className="w-full py-3.5 border border-secondary text-secondary font-semibold rounded-lg bg-transparent"
          onClick={() => navigate("/nominee/login")}
        >
          I am a nominee
        </PressableButton>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="mt-8 text-xs text-muted-foreground text-center"
      >
        Used by families across India. Free forever for basic use.
      </motion.p>
    </div>
  );
};

export default Splash;
