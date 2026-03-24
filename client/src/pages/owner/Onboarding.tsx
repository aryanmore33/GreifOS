import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition, PressableButton, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { AssetCard } from "@/components/AssetCard";
import { mockAssets } from "@/lib/mockData";
import { Smartphone, Plus, X } from "lucide-react";

const steps = ["Permission", "Review", "Secure"];

const ProgressBar = ({ step }: { step: number }) => (
  <div className="flex gap-2 mb-8">
    {steps.map((s, i) => (
      <div key={s} className="flex-1">
        <div className={`h-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-muted"}`} />
        <p className={`text-xs mt-1 text-center ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</p>
      </div>
    ))}
  </div>
);

const Step1 = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col items-center text-center pt-8 max-w-md mx-auto">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 rounded-full bg-primary/20 flex items-center justify-center">
        <Smartphone size={36} className="text-primary" />
      </div>
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-signal-wave" />
      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-signal-wave-delayed" />
      <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-signal-wave-delayed-2" />
    </div>
    <h2 className="text-xl font-bold mb-2 text-foreground">Let your phone do the work</h2>
    <p className="text-sm text-muted-foreground mb-8 px-4">
      GriefOS reads your last 6 months of SMS to automatically find your banks, insurers, and subscriptions. Nothing leaves your device.
    </p>
    <PressableButton className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg" onClick={onNext}>
      Grant SMS Access
    </PressableButton>
    <p className="text-xs text-muted-foreground mt-3">Parsed locally. Never uploaded. Ever.</p>
  </div>
);

const Step2 = ({ onNext }: { onNext: () => void }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="pt-4">
      <h2 className="text-xl font-bold mb-1 text-foreground">Review Your Financial Map</h2>
      <p className="text-sm text-muted-foreground mb-4">We detected the following from your SMS.</p>
      <StaggerContainer className="space-y-3">
        {mockAssets.map((a) => (
          <StaggerItem key={a.id}><AssetCard asset={a} /></StaggerItem>
        ))}
      </StaggerContainer>

      <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-sm text-secondary mt-4 mb-4">
        <Plus size={16} /> Add manually
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card-grief space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">Add Asset</span>
                <button onClick={() => setShowForm(false)}><X size={16} className="text-muted-foreground" /></button>
              </div>
              <input placeholder="Institution name" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              <select className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                <option>Bank</option><option>Insurance</option><option>Investment</option><option>Subscription</option>
              </select>
              <textarea placeholder="Notes" rows={2} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              <PressableButton className="w-full py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg text-sm">
                Add
              </PressableButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PressableButton className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg" onClick={onNext}>
        Looks good, secure this →
      </PressableButton>
    </div>
  );
};

const Step3 = ({ onFinish }: { onFinish: () => void }) => {
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const strength = password.length < 4 ? 0 : password.length < 8 ? 1 : 2;
  const strengthColors = ["bg-destructive", "bg-amber", "bg-accent"];
  const strengthWidths = ["w-1/3", "w-2/3", "w-full"];

  return (
    <div className="pt-4 space-y-5 max-w-lg mx-auto">
      <div>
        <h2 className="text-xl font-bold mb-1 text-foreground">Secure Your Vault</h2>
        <p className="text-sm text-muted-foreground">Set a password and designate your nominee.</p>
      </div>

      <div className="space-y-3">
        <input
          type="password"
          placeholder="Create vault password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${strengthColors[strength]} ${strengthWidths[strength]}`} />
        </div>
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full bg-input border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div>
        <h3 className="text-base font-semibold mb-3 text-foreground">Who is your nominee?</h3>
        <div className="space-y-3">
          <input placeholder="Full name" className="w-full bg-input border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
          <div className="flex">
            <span className="bg-muted border border-border rounded-l-lg px-3 py-3 text-sm text-muted-foreground">+91</span>
            <input placeholder="Phone number" className="flex-1 bg-input border border-border border-l-0 rounded-r-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
          </div>
          <select className="w-full bg-input border border-border rounded-lg px-3 py-3 text-sm text-foreground">
            <option>Spouse</option><option>Child</option><option>Parent</option><option>Sibling</option><option>Other</option>
          </select>
        </div>
      </div>

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-primary" />
        I understand that only this person can unlock my vault after my passing
      </label>

      <PressableButton className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg" onClick={onFinish}>
        Seal my vault
      </PressableButton>
    </div>
  );
};

const VaultSealAnimation = ({ onDone }: { onDone: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 0.3], rotate: [0, 0, 360] }}
        transition={{ duration: 2, times: [0, 0.4, 1], ease: "easeInOut" }}
        onAnimationComplete={onDone}
      >
        <motion.div
          className="w-32 h-32 rounded-full border-4 border-secondary flex items-center justify-center"
          animate={{ borderColor: ["#0D7377", "#6C3483", "#1A6B3A"] }}
          transition={{ duration: 2 }}
        >
          <motion.div
            animate={{ scale: [1, 0.5, 1.5] }}
            transition={{ duration: 2, times: [0, 0.5, 1] }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0D7377" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [sealing, setSealing] = useState(false);

  return (
    <>
      <AnimatePresence>
        {sealing && <VaultSealAnimation onDone={() => navigate("/owner/dashboard")} />}
      </AnimatePresence>
      <PageTransition>
        <div className="p-6 app-container">
          <ProgressBar step={step} />
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <Step1 onNext={() => setStep(1)} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <Step2 onNext={() => setStep(2)} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <Step3 onFinish={() => setSealing(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    </>
  );
};

export default Onboarding;
