import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Swap from "./pages/Swap";
import Bridge from "./pages/Bridge";
import NFTs from "./pages/NFTs";
import NFTMint from "./pages/NFTMint";
import FractionalAuction from "./pages/FractionalAuction";
import Chat from "./pages/Chat";
import Governance from "./pages/Governance";
import Yield from "./pages/Yield";
import SocialTrading from "./pages/SocialTrading";
import Streams from "./pages/Streams";
import AIAssistant from "./pages/AIAssistant";
import Feed from "./pages/Feed";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import WishExec from "./pages/WishExec";
import ChainShrink from "./pages/ChainShrink";
import MempoolStories from "./pages/MempoolStories";
import TrustGraph from "./pages/TrustGraph";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/bridge" element={<Bridge />} />
              <Route path="/nfts" element={<NFTs />} />
              <Route path="/nfts/mint" element={<NFTMint />} />
              <Route path="/nfts/fractional" element={<FractionalAuction />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/yield" element={<Yield />} />
              <Route path="/social" element={<SocialTrading />} />
              <Route path="/streams" element={<Streams />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/wishexec" element={<WishExec />} />
              <Route path="/chain-shrink" element={<ChainShrink />} />
              <Route path="/mempool" element={<MempoolStories />} />
              <Route path="/trust-graph" element={<TrustGraph />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
