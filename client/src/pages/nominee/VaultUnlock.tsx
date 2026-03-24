import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VaultUnlock = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2600),
      setTimeout(() => navigate("/nominee/dashboard"), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="mobile-container fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <motion.div
          className="relative"
          animate={{
            filter: phase >= 1 ? "drop-shadow(0 0 30px #0D7377)" : "none",
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg
            width="80" height="80" viewBox="0 0 24 24" fill="none"
            stroke="#0D7377" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <motion.path
              d="M7 11V7a5 5 0 0 1 10 0v4"
              animate={phase >= 2 ? { d: "M7 11V7a5 5 0 0 1 10 0v1" } : {}}
              transition={{ duration: 0.5 }}
            />
          </motion.svg>
        </motion.div>

        {phase >= 2 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.8 }}
            style={{ background: "radial-gradient(circle, #0D7377 0%, transparent 70%)" }}
          />
        )}

        {phase >= 3 && (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mt-8 text-foreground"
          >
            Vault unlocked
          </motion.h2>
        )}

        {phase >= 4 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm mt-2 text-secondary"
          >
            Everything your family needs is here.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default VaultUnlock;
