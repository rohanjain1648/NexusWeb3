import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CHAINS, GAS_PRICES } from "@/lib/mockData";
import { User, Shield, Fuel, Palette, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { address, ensName, disconnect } = useWallet();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Identity, preferences & gas optimization</p>
      </div>

      {/* Identity */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Identity</h2>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-2xl">🦊</div>
          <div>
            <p className="font-bold text-lg">{ensName}</p>
            <p className="text-xs text-muted-foreground font-mono">0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Use ENS name as display</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Decentralized Identity (Worldcoin)</span>
            <Switch />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4 text-neon-green" /> Security</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm">Multi-Sig Wallet</p>
              <p className="text-xs text-muted-foreground">Require multiple signatures for high-value txs</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm">Transaction Simulation</p>
              <p className="text-xs text-muted-foreground">Preview transaction effects before signing</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Gas Optimizer */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Fuel className="h-4 w-4 text-neon-orange" /> Gas Optimizer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["slow", "standard", "fast", "instant"] as const).map((speed) => (
            <div key={speed} className={`p-3 rounded-xl text-center transition-colors cursor-pointer ${speed === "standard" ? "bg-primary/10 border border-primary/20" : "bg-muted/30 hover:bg-muted/40"}`}>
              <p className="text-lg font-bold">{GAS_PRICES[speed]}</p>
              <p className="text-xs text-muted-foreground capitalize">{speed}</p>
              <p className="text-[10px] text-muted-foreground/60">Gwei</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Auto-batch transactions</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Gasless meta-transactions</span>
            <Switch />
          </div>
        </div>
      </div>

      {/* Chain Preferences */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Palette className="h-4 w-4 text-secondary" /> Chain Preferences</h2>
        <div className="space-y-2">
          {CHAINS.map((chain) => (
            <div key={chain.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span>{chain.icon}</span>
                <span className="text-sm">{chain.name}</span>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <Button variant="destructive" className="w-full" onClick={handleDisconnect}>
        <LogOut className="h-4 w-4 mr-2" /> Disconnect Wallet
      </Button>
    </div>
  );
}
