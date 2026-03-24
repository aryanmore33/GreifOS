import { useEffect, useState } from "react";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCounter, PressableButton } from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Portal {
  name: string;
  description: string;
  status: "scanning" | "found" | "none";
  result?: string;
  amount?: number;
}

const AssetScanner = () => {
  const navigate = useNavigate();
  const [portals, setPortals] = useState<Portal[]>([
    { name: "IEPF Portal", description: "Searching for unclaimed shares & dividends...", status: "scanning" },
    { name: "IRDAI Portal", description: "Searching for unclaimed insurance amounts...", status: "scanning" },
    { name: "RBI Portal", description: "Searching for unclaimed deposits...", status: "scanning" },
  ]);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPortals((prev) => prev.map((p, i) => i === 0 ? { ...p, status: "found", result: "₹14,200 in unclaimed dividends found", amount: 14200 } : p));
    }, 2000);
    const t2 = setTimeout(() => {
      setPortals((prev) => prev.map((p, i) => i === 1 ? { ...p, status: "found", result: "1 unclaimed policy amount — ₹45,000", amount: 45000 } : p));
    }, 4000);
    const t3 = setTimeout(() => {
      setPortals((prev) => prev.map((p, i) => i === 2 ? { ...p, status: "none", result: "No results found" } : p));
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const total = portals.reduce((s, p) => s + (p.amount || 0), 0);
  const allDone = portals.every((p) => p.status !== "scanning");

  return (
    <PageTransition>
      <div className="p-6 app-container">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-xl font-bold mb-1 text-foreground">Hidden Money Finder</h1>
        <p className="text-sm text-muted-foreground mb-6">Searching government portals for unclaimed assets in Rahul's name.</p>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {portals.map((p) => (
            <StaggerItem key={p.name}>
              <div className={`card-grief ${p.status === "found" ? "border-accent/50" : ""}`}>
                <p className="font-semibold text-sm text-foreground mb-1">{p.name}</p>
                {p.status === "scanning" ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-secondary rounded-full w-1/3"
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </>
                ) : (
                  <p className={`text-sm ${p.status === "found" ? "text-accent font-semibold" : "text-muted-foreground"}`}>
                    {p.result}
                  </p>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {allDone && total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-3xl font-bold text-accent">
              ₹<AnimatedCounter value={total} />
            </p>
            <p className="text-sm text-muted-foreground mt-1">potentially recoverable</p>
            <PressableButton className="mt-4 w-full py-3 bg-accent text-accent-foreground font-semibold rounded-lg">
              How to claim these →
            </PressableButton>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default AssetScanner;
