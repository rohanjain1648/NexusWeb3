import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, Zap, Globe, ArrowRight } from "lucide-react";

const features = [
  { icon: Zap, title: "Real-Time Updates", desc: "Live blockchain data streaming to your dashboard" },
  { icon: Shield, title: "Decentralized & Secure", desc: "Non-custodial wallet integration with full control" },
  { icon: Globe, title: "Multi-Chain", desc: "Ethereum, Polygon, Arbitrum, Optimism & more" },
];

const walletProviders = [
  { name: "MetaMask", icon: "🦊", popular: true },
  { name: "WalletConnect", icon: "🔗", popular: true },
  { name: "Coinbase Wallet", icon: "🔵", popular: false },
  { name: "Phantom", icon: "👻", popular: false },
];

export default function Landing() {
  const { connect } = useWallet();
  const navigate = useNavigate();

  const handleConnect = (provider: string) => {
    connect();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-in">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-black text-primary-foreground shadow-lg shadow-primary/30">
              W3
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="gradient-text">NexusWeb3</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            The Next-Generation Web3 Hub
          </p>
          <p className="text-sm text-muted-foreground/60 mb-12 max-w-lg mx-auto">
            Real-time DeFi dashboard, DEX aggregation, NFT marketplace, decentralized chat, DAO governance — all in one beautiful interface.
          </p>

          {/* Wallet Connect Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto mb-12">
            {walletProviders.map((w) => (
              <button
                key={w.name}
                onClick={() => handleConnect(w.name)}
                className="glass-card-hover p-4 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{w.icon}</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{w.name}</span>
                {w.popular && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">Popular</span>
                )}
              </button>
            ))}
          </div>

          <Button
            size="lg"
            className="gradient-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            onClick={() => handleConnect("MetaMask")}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {features.map((f) => (
            <div key={f.title} className="glass-card p-5 text-center">
              <f.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground/40 border-t border-border/30">
        NexusWeb3 — Built for the Web3 Hackathon 2026
      </footer>
    </div>
  );
}
