import { useState } from "react";
import { CHAINS, BRIDGE_ROUTES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, DollarSign, Loader2, CheckCircle } from "lucide-react";

export default function Bridge() {
  const [fromChain, setFromChain] = useState(1);
  const [toChain, setToChain] = useState(137);
  const [amount, setAmount] = useState("1000");
  const [bridging, setBridging] = useState(false);
  const [done, setDone] = useState(false);

  const handleBridge = () => {
    setBridging(true);
    setTimeout(() => { setBridging(false); setDone(true); setTimeout(() => setDone(false), 3000); }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Cross-Chain Bridge</h1>
        <p className="text-sm text-muted-foreground">Compare routes across bridge protocols</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">From</label>
            <select value={fromChain} onChange={(e) => setFromChain(Number(e.target.value))} className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50">
              {CHAINS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <button onClick={() => { setFromChain(toChain); setToChain(fromChain); }} className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors mb-0.5">
            <ArrowRight className="h-4 w-4 text-primary" />
          </button>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">To</label>
            <select value={toChain} onChange={(e) => setToChain(Number(e.target.value))} className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50">
              {CHAINS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-muted/40 rounded-xl p-4">
          <label className="text-xs text-muted-foreground mb-2 block">Amount (USDC)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-transparent text-2xl font-bold w-full outline-none" placeholder="0.0" />
        </div>

        <Button className="w-full gradient-primary text-primary-foreground font-semibold py-6 rounded-xl" onClick={handleBridge} disabled={bridging}>
          {bridging ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Bridging...</> :
           done ? <><CheckCircle className="h-4 w-4 mr-2" /> Bridge Complete!</> :
           "Bridge Assets"}
        </Button>
      </div>

      {/* Route Comparison */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Route Comparison</h3>
        <div className="space-y-3">
          {BRIDGE_ROUTES.map((route, i) => (
            <div key={route.provider} className={`p-4 rounded-xl transition-colors ${i === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{route.provider}</span>
                {i === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Recommended</span>}
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Fee: {route.fee}</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {route.time}</div>
                <div className="flex items-center gap-1"><Star className="h-3 w-3" /> {route.rating}/5</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
