import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Splash from "./pages/Splash";
import Onboarding from "./pages/owner/Onboarding";
import Dashboard from "./pages/owner/Dashboard";
import NomineeLogin from "./pages/nominee/NomineeLogin";
import VaultUnlock from "./pages/nominee/VaultUnlock";
import NomineeDashboard from "./pages/nominee/NomineeDashboard";
import Checklist from "./pages/nominee/Checklist";
import DraftLetters from "./pages/nominee/DraftLetters";
import AssetScanner from "./pages/nominee/AssetScanner";
import ChatAssistant from "./pages/nominee/ChatAssistant";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/owner/onboarding" element={<Onboarding />} />
            <Route path="/owner/dashboard" element={<Dashboard />} />
            <Route path="/nominee/login" element={<NomineeLogin />} />
            <Route path="/nominee/unlock" element={<VaultUnlock />} />
            <Route path="/nominee/dashboard" element={<NomineeDashboard />} />
            <Route path="/nominee/checklist" element={<Checklist />} />
            <Route path="/nominee/letters" element={<DraftLetters />} />
            <Route path="/nominee/scanner" element={<AssetScanner />} />
            <Route path="/nominee/chat" element={<ChatAssistant />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
