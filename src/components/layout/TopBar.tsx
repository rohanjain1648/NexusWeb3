import { Bell, ChevronDown, Fuel, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GAS_PRICES, CHAINS } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const { address, ensName, chainId, chains, switchChain, disconnect } = useWallet();
  const navigate = useNavigate();
  const currentChain = chains.find((c) => c.id === chainId) || CHAINS[0];

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex items-center gap-3">
        {/* Gas Price */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <Fuel className="h-3 w-3" />
          <span>{GAS_PRICES.standard} Gwei</span>
        </div>

        {/* Chain Selector */}
        <button
          onClick={() => {
            const idx = chains.findIndex((c) => c.id === chainId);
            switchChain(chains[(idx + 1) % chains.length].id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
        >
          <span>{currentChain.icon}</span>
          <span className="hidden sm:inline">{currentChain.name}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* Wallet */}
        <button
          onClick={disconnect}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-sm transition-colors"
        >
          <span className="text-primary">🦊</span>
          <span className="hidden sm:inline font-mono text-xs">{ensName || address}</span>
        </button>
      </div>
    </header>
  );
}
