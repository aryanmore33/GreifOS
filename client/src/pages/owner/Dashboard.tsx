import { useNavigate } from "react-router-dom";
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/PageTransition";
import { AssetCard } from "@/components/AssetCard";
import { BottomNav } from "@/components/BottomNav";
import { mockAssets } from "@/lib/mockData";
import { Shield, Settings, Edit } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "assets detected", value: 7, color: "text-secondary" },
    { label: "nominee set", value: 1, color: "text-primary" },
  ];

  return (
    <PageTransition>
      <div className="p-6 pb-24 app-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-secondary" />
            <span className="font-bold text-lg text-foreground">GriefOS</span>
          </div>
          <button onClick={() => navigate("/settings")}><Settings size={20} className="text-muted-foreground" /></button>
        </div>

        <StaggerContainer className="space-y-4">
          <StaggerItem>
            <div className="card-grief">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">Your vault is active, Rahul</span>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {stats.map((s, i) => (
                <div key={i} className="card-grief text-center">
                  <p className={`text-2xl font-bold ${s.color}`}><AnimatedCounter value={s.value} /></p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
              <div className="card-grief text-center">
                <p className="text-xs font-semibold text-foreground">Last updated</p>
                <p className="text-xs text-muted-foreground mt-1">Today</p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mt-2">Your Financial Map</h3>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockAssets.map((a) => (
                <AssetCard key={a.id} asset={a} />
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mt-4">Nominee</h3>
          </StaggerItem>

          <StaggerItem>
            <div className="card-grief flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">Priya Sharma</p>
                <p className="text-xs text-muted-foreground">******7890 · Spouse</p>
              </div>
              <button className="text-secondary"><Edit size={16} /></button>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default Dashboard;
