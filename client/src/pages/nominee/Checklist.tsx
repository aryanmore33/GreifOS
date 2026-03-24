import { useState } from "react";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { mockChecklist, ChecklistItem } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "6 Months", value: "sixmonths" },
] as const;

const Checklist = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("week");
  const [items, setItems] = useState(mockChecklist);

  const filtered = items.filter((it) => it.period === activeTab && !it.done);

  const markDone = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: true } : it)));
  };

  const urgencyColor = { red: "bg-destructive", amber: "bg-amber", green: "bg-accent" };

  return (
    <PageTransition>
      <div className="p-6 app-container">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-xl font-bold mb-4 text-foreground">Your Action Plan</h1>

        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === t.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <StaggerContainer className="space-y-3">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, x: -200, backgroundColor: "hsl(145, 60%, 26%)" }}
                transition={{ duration: 0.3 }}
              >
                <StaggerItem>
                  <div className="card-grief flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${urgencyColor[item.urgency]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <button
                      onClick={() => markDone(item.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </StaggerItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </StaggerContainer>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(145, 60%, 26%)" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">All tasks completed for this period!</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Checklist;
