import { WHALE_WALLETS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Copy, Eye, TrendingUp, Trophy } from "lucide-react";

export default function SocialTrading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Social Trading</h1>
        <p className="text-sm text-muted-foreground">Track & copy top-performing wallets</p>
      </div>

      {/* Leaderboard */}
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Trophy className="h-4 w-4 text-neon-orange" /> Top Traders</h2>
        <div className="space-y-3">
          {WHALE_WALLETS.map((w, i) => (
            <div key={w.address} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`text-lg font-bold ${i === 0 ? "text-neon-orange" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-neon-orange/60" : "text-muted-foreground/60"}`}>
                  #{i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{w.label}</p>
                    <span className="font-mono text-xs text-muted-foreground">{w.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{w.trades} trades</span>
                    <span>Win rate: {w.winRate}</span>
                    <span>Top: {w.topToken}</span>
                    <span>{w.lastActive}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-neon-green">{w.pnl}</p>
                  <p className="text-xs text-neon-green">{w.pnlPercent}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy Trade Config */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold">Copy Trade Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Max Position Size</label>
            <input className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50" placeholder="1.0 ETH" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Stop Loss</label>
            <input className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50" placeholder="-10%" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Take Profit</label>
            <input className="w-full bg-muted/40 rounded-xl px-4 py-3 text-sm outline-none border border-border/50" placeholder="+50%" />
          </div>
        </div>
        <Button className="gradient-primary text-primary-foreground font-semibold px-8">Enable Copy Trading</Button>
      </div>
    </div>
  );
}
