import { useState } from "react";
import { PageTransition, StaggerContainer, StaggerItem, PressableButton, SkeletonPulse } from "@/components/PageTransition";
import { mockLetters } from "@/lib/mockData";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const DraftLetters = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState(mockLetters);
  const [generating, setGenerating] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const generate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, status: "generated" as const } : l)));
      setGenerating(null);
      setPreview(id);
    }, 1500);
  };

  const previewLetter = letters.find((l) => l.id === preview);

  return (
    <PageTransition>
      <div className="p-6 app-container">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-xl font-bold mb-1 text-foreground">Legal Letters</h1>
        <p className="text-sm text-muted-foreground mb-6">Generated specifically for each institution. Ready to print and sign.</p>

        <AnimatePresence>
          {preview && previewLetter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6"
            >
              <div className="bg-foreground rounded-xl p-5 text-background text-sm leading-relaxed">
                <p className="font-bold mb-2">To,<br/>The Branch Manager<br/>{previewLetter.institution}</p>
                <p className="mb-2">Subject: {previewLetter.letterType}</p>
                <p className="mb-2">Dear Sir/Madam,</p>
                <p className="mb-2">I am writing to inform you of the passing of Mr. Rahul Sharma, who held an account with your institution. As the legal nominee, I request the initiation of the account closure/transfer process as per the applicable regulations.</p>
                <p className="mb-2">I have enclosed the necessary documents including the death certificate, nominee identification, and relevant account details for your reference.</p>
                <p>Yours sincerely,<br/>Priya Sharma<br/>Nominee</p>
              </div>
              <div className="flex gap-3 mt-3">
                <PressableButton className="flex-1 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg text-sm flex items-center justify-center gap-2">
                  <Download size={16} /> Download PDF
                </PressableButton>
                <PressableButton className="flex-1 py-2.5 bg-muted text-foreground font-semibold rounded-lg text-sm flex items-center justify-center gap-2">
                  <Share2 size={16} /> Share
                </PressableButton>
              </div>
              <button onClick={() => setPreview(null)} className="text-xs text-muted-foreground mt-2 w-full text-center">Close preview</button>
            </motion.div>
          )}
        </AnimatePresence>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {letters.map((l) => (
            <StaggerItem key={l.id}>
              <div className="card-grief flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-foreground" style={{ backgroundColor: l.color + "33" }}>
                  {l.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{l.institution}</p>
                  <p className="text-xs text-muted-foreground">{l.letterType}</p>
                </div>
                {generating === l.id ? (
                  <SkeletonPulse className="w-20 h-8" />
                ) : l.status === "generated" ? (
                  <button onClick={() => setPreview(l.id)} className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent/20 text-accent">View</button>
                ) : (
                  <PressableButton onClick={() => generate(l.id)} className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber/20 text-amber">
                    Generate
                  </PressableButton>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  );
};

export default DraftLetters;
