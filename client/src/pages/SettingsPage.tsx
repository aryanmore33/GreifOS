import { PageTransition } from "@/components/PageTransition";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Vault",
    items: [
      { label: "Update financial map", destructive: false },
      { label: "Change vault password", destructive: false },
      { label: "Export vault summary (PDF)", destructive: false },
    ],
  },
  {
    title: "Nominee",
    items: [
      { label: "Change nominee details", destructive: false },
      { label: "Send test notification to nominee", destructive: false },
    ],
  },
  {
    title: "Privacy",
    items: [
      { label: "View audit log", destructive: false },
      { label: "Delete all data", destructive: true },
    ],
  },
  {
    title: "About",
    items: [
      { label: "How GriefOS works", destructive: false },
      { label: "Privacy policy", destructive: false },
      { label: "Version 1.0.0", destructive: false },
    ],
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="p-6 pb-24 app-container">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-xl font-bold mb-6 text-foreground">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((s) => (
          <div key={s.title}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{s.title}</h3>
            <div className="card-grief divide-y divide-border">
              {s.items.map((item) => (
                <button key={item.label} className="w-full flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className={`text-sm ${item.destructive ? "text-destructive" : "text-foreground"}`}>{item.label}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default SettingsPage;
