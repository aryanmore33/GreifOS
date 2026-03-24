import { Home, Briefcase, UserCheck, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/owner/dashboard" },
  { icon: Briefcase, label: "Assets", path: "/owner/dashboard" },
  { icon: UserCheck, label: "Nominee", path: "/owner/dashboard" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] md:max-w-2xl lg:max-w-5xl xl:max-w-6xl bg-card border-t border-border">
      <div className="flex justify-around py-3 max-w-md md:max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path && item.label === "Home" || 
            (item.label === "Settings" && location.pathname === "/settings");
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 text-xs transition-colors ${active ? "text-secondary" : "text-muted-foreground"}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
