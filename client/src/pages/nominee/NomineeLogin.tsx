import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition, PressableButton, SkeletonPulse } from "@/components/PageTransition";
import { Upload, CheckCircle } from "lucide-react";

const NomineeLogin = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"phone" | "otp" | "upload" | "verifying" | "verified">("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const sendOtp = () => setPhase("otp");

  const verifyOtp = () => setPhase("upload");

  const handleUpload = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setPhase("verifying");
        setTimeout(() => setPhase("verified"), 2000);
      }
    }, 200);
  };

  const unlock = () => navigate("/nominee/unlock");

  return (
    <PageTransition>
      <div className="p-6 pt-16 flex flex-col items-center app-container">
        <h1 className="text-2xl font-bold mb-2 text-foreground">Nominee Access</h1>
        <p className="text-sm text-muted-foreground mb-8 text-center">This section is for the family member designated to manage the estate.</p>

        <AnimatePresence mode="wait">
          {phase === "phone" && (
            <motion.div key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md space-y-4">
              <div className="flex">
                <span className="bg-muted border border-border rounded-l-lg px-3 py-3 text-sm text-muted-foreground">+91</span>
                <input placeholder="Phone number" className="flex-1 bg-input border border-border border-l-0 rounded-r-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
              <PressableButton className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg" onClick={sendOtp}>
                Send OTP
              </PressableButton>
            </motion.div>
          )}

          {phase === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    maxLength={1}
                    className="w-11 h-12 bg-input border border-border rounded-lg text-center text-lg font-bold text-foreground"
                  />
                ))}
              </div>
              <PressableButton className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg" onClick={verifyOtp}>
                Verify
              </PressableButton>
            </motion.div>
          )}

          {(phase === "upload" || phase === "verifying" || phase === "verified") && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md space-y-4">
              <p className="text-sm text-muted-foreground">Upload death certificate</p>
              {phase === "upload" && uploadProgress === 0 && (
                <button
                  onClick={handleUpload}
                  className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-secondary transition-colors"
                >
                  <Upload size={28} />
                  <span className="text-sm">PDF or Image</span>
                </button>
              )}
              {phase === "upload" && uploadProgress > 0 && (
                <div className="card-grief">
                  <p className="text-sm text-foreground mb-2">Uploading...</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div className="h-full bg-secondary rounded-full" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
              {phase === "verifying" && (
                <div className="card-grief space-y-3">
                  <p className="text-sm text-foreground">Verifying document...</p>
                  <SkeletonPulse className="h-4 w-3/4" />
                  <SkeletonPulse className="h-4 w-1/2" />
                </div>
              )}
              {phase === "verified" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="card-grief flex items-center gap-3"
                >
                  <CheckCircle size={24} className="text-accent" />
                  <span className="text-sm font-semibold text-foreground">Certificate verified</span>
                </motion.div>
              )}
              {phase === "verified" && (
                <PressableButton className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg" onClick={unlock}>
                  Unlock vault →
                </PressableButton>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default NomineeLogin;
