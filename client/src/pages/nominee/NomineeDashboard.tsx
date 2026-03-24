import { useNavigate } from "react-router-dom";
import { PageTransition, StaggerContainer, StaggerItem, PressableButton } from "@/components/PageTransition";
import { Shield, ClipboardList, FileText, Search, XCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  { title: "Legal Checklist", sub: "23 tasks · 3 urgent", icon: ClipboardList, color: "bg-primary", path: "/nominee/checklist", progress: 0 },
  { title: "Draft Letters", sub: "7 letters ready to generate", icon: FileText, color: "bg-secondary", path: "/nominee/letters", extra: "Tap to create →" },
  { title: "Unclaimed Assets", sub: "Scanning 3 portals...", icon: Search, color: "bg-amber", path: "/nominee/scanner", scanning: true },
  { title: "Kill Subscriptions", sub: "4 active charges found", icon: XCircle, color: "bg-destructive", path: "/nominee/checklist", extra: "₹2,340 / month to cancel" },
];

const NomineeDashboard = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="p-6 pb-24 app-container">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={24} className="text-secondary" />
          <span className="font-bold text-lg text-foreground">GriefOS</span>
          <span className="ml-auto px-2 py-0.5 bg-destructive/20 text-destructive text-xs font-semibold rounded-full">Nominee Mode</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Here is everything you need to manage Rahul's estate.</p>

        <StaggerContainer className="space-y-4">
          <StaggerItem>
            <div className="bg-amber/20 border border-amber/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">3 actions needed in the next 7 days</p>
                <p className="text-xs text-muted-foreground">Time-sensitive tasks require immediate attention</p>
              </div>
              <span className="text-lg font-bold text-amber">7d</span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {cards.map((c) => (
                <PressableButton
                  key={c.title}
                  className={`${c.color} rounded-xl p-4 text-left`}
                  onClick={() => navigate(c.path)}
                >
                  <c.icon size={24} className="mb-2 text-foreground" />
                  <p className="font-semibold text-sm text-foreground">{c.title}</p>
                  <p className="text-xs text-foreground/70 mt-1">{c.sub}</p>
                  {c.progress !== undefined && (
                    <div className="h-1 bg-foreground/20 rounded-full mt-2">
                      <div className="h-full bg-foreground/60 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  )}
                  {c.scanning && (
                    <div className="h-1 bg-foreground/20 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-foreground/60 rounded-full w-1/3"
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                  {c.extra && <p className="text-xs text-foreground/60 mt-1">{c.extra}</p>}
                </PressableButton>
              ))}
            </div>
          </StaggerItem>
        </StaggerContainer>

        <motion.button
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: ["0 0 0 0 rgba(108,52,131,0.4)", "0 0 0 12px rgba(108,52,131,0)", "0 0 0 0 rgba(108,52,131,0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => navigate("/nominee/chat")}
        >
          <MessageCircle size={24} className="text-foreground" />
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default NomineeDashboard;
