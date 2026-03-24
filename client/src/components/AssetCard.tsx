import { Landmark, Shield, TrendingUp, Tv } from "lucide-react";
import { Asset } from "@/lib/mockData";
import { useState } from "react";

const iconMap = {
  bank: { icon: Landmark, color: "#3B82F6" },
  insurance: { icon: Shield, color: "#0D7377" },
  investment: { icon: TrendingUp, color: "#B7770D" },
  subscription: { icon: Tv, color: "#C0392B" },
};

export const AssetCard = ({ asset }: { asset: Asset }) => {
  const [enabled, setEnabled] = useState(asset.enabled);
  const { icon: Icon, color } = iconMap[asset.type];

  return (
    <div className="card-grief flex items-center gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color + "22" }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{asset.name}</p>
        <p className="text-xs text-muted-foreground">{asset.accountType}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${enabled ? "bg-accent border-accent" : "border-muted-foreground"}`}
      >
        {enabled && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
};
