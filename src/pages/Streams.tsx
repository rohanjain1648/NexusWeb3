import { useState, useEffect } from "react";
import { STREAMS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Waves, Play, Pause, Plus } from "lucide-react";

export default function Streams() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Streams</h1>
          <p className="text-sm text-muted-foreground">Real-time continuous payments</p>
        </div>
        <Button className="gradient-primary" size="sm"><Plus className="h-4 w-4 mr-1" /> New Stream</Button>
      </div>

      <div className="space-y-4">
        {STREAMS.map((stream) => (
          <div key={stream.id} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stream.status === "active" ? "bg-neon-green/20" : "bg-neon-orange/20"}`}>
                  <Waves className={`h-5 w-5 ${stream.status === "active" ? "text-neon-green" : "text-neon-orange"}`} />
                </div>
                <div>
                  <p className="font-semibold">→ {stream.recipientName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{stream.recipient}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                {stream.status === "active" ? <Pause className="h-4 w-4 text-neon-green" /> : <Play className="h-4 w-4 text-neon-orange" />}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Token</p>
                <p className="font-medium">{stream.token}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Flow Rate</p>
                <p className="font-medium font-mono text-primary">{stream.flowRate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Streamed</p>
                <p className="font-medium text-neon-green">{stream.totalStreamed}</p>
              </div>
            </div>

            {stream.status === "active" && (
              <div className="mt-4 h-1 rounded-full bg-muted/40 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-neon-cyan rounded-full animate-shimmer" style={{ width: "60%", backgroundSize: "200% 100%" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Stream Form */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold">Create New Stream</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Recipient (ENS/Address)</label>
            <input className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50" placeholder="alice.eth" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Token</label>
            <select className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50">
              <option>USDC</option><option>DAI</option><option>ETH</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Flow Rate (per month)</label>
            <input className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50" placeholder="1000" />
          </div>
        </div>
        <Button className="gradient-primary text-primary-foreground font-semibold px-8">Start Streaming</Button>
      </div>
    </div>
  );
}
