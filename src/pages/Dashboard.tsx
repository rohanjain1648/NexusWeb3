import { useState, useEffect } from "react";
import { CHAINS } from "@/lib/mockData";
import { useWallet } from "@/contexts/WalletContext";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { ArrowUpRight, ArrowDownRight, Fuel, Activity, TrendingUp, Wallet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { chainId } = useWallet();
  const { tokens, gasPrice, portfolioHistory, transactions, totalStreamed, pnl, portfolioValue } = useRealtimeData();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 3000);
    return () => clearInterval(interval);
  }, []);

  const pnlPositive = pnl >= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Live Activity Ticker */}
      <div className="glass-card overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card/90 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card/90 to-transparent z-10" />
        <div className="flex items-center">
          <div className="shrink-0 px-3 py-2 bg-primary/15 border-r border-border/50 z-20">
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Live</span>
          </div>
          <div className="overflow-hidden py-2">
            <div className="flex gap-6 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
              {[...transactions, ...transactions].map((tx, i) => (
                <span key={`${tx.id}-${i}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${tx.status === "confirmed" ? "bg-neon-green" : "bg-neon-orange"}`} />
                  <span className="font-medium text-foreground capitalize">{tx.type}</span>
                  <span>{tx.amount}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="font-mono text-[10px]">{tx.hash}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time portfolio overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/10 text-neon-green text-xs">
            <span className={`h-2 w-2 rounded-full bg-neon-green ${pulse ? "opacity-100" : "opacity-50"} transition-opacity`} />
            Live
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Portfolio Value" value={`$${portfolioValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`} change="+5.34%" positive />
        <StatCard icon={TrendingUp} label="24h P&L" value={`${pnlPositive ? "+" : ""}$${Math.abs(pnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change={`${pnlPositive ? "+" : ""}${(pnl / portfolioValue * 100).toFixed(2)}%`} positive={pnlPositive} />
        <StatCard icon={Activity} label="Active Streams" value="3" change={`$${totalStreamed.toLocaleString("en-US", { minimumFractionDigits: 2 })} streamed`} positive />
        <StatCard icon={Fuel} label="Gas Price" value={`${gasPrice} Gwei`} change={gasPrice < 15 ? "🟢 Low" : gasPrice < 25 ? "🟡 Standard" : "🔴 High"} positive={gasPrice < 25} />
      </div>

      {/* Portfolio Chart */}
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-4">Portfolio Performance (30d)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioHistory}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(265, 90%, 65%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(265, 90%, 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(230, 25%, 11%)", border: "1px solid hsl(230, 20%, 18%)", borderRadius: 12, color: "hsl(210, 40%, 96%)" }} formatter={(value: number) => [`$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, "Value"]} />
              <Area type="monotone" dataKey="value" stroke="hsl(265, 90%, 65%)" fill="url(#grad)" strokeWidth={2} animationDuration={500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Balances */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">Token Balances</h2>
          <div className="space-y-3">
            {tokens.slice(0, 6).map((token) => (
              <div key={token.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{token.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm tabular-nums">${(token.price * token.balance).toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                  <p className={`text-xs flex items-center gap-0.5 justify-end tabular-nums ${token.change24h >= 0 ? "text-neon-green" : "text-destructive"}`}>
                    {token.change24h >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(token.change24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    tx.type === "swap" ? "bg-primary/20 text-primary" :
                    tx.type === "receive" ? "bg-neon-green/20 text-neon-green" :
                    tx.type === "send" ? "bg-neon-orange/20 text-neon-orange" :
                    tx.type === "mint" ? "bg-neon-cyan/20 text-neon-cyan" :
                    "bg-secondary/20 text-secondary"
                  }`}>
                    {tx.type === "swap" ? "⟳" : tx.type === "receive" ? "↓" : tx.type === "send" ? "↑" : tx.type === "mint" ? "✦" : "⟷"}
                  </div>
                  <div>
                    <p className="font-medium text-sm capitalize">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{tx.amount}</p>
                  <p className={`text-xs ${tx.status === "confirmed" ? "text-neon-green" : "text-neon-orange"}`}>
                    {tx.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Chains */}
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-4">Connected Chains</h2>
        <div className="flex flex-wrap gap-3">
          {CHAINS.map((chain) => (
            <div key={chain.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
              chain.id === chainId ? "border-primary/50 bg-primary/10" : "border-border/50 bg-muted/30"
            }`}>
              <span>{chain.icon}</span>
              <span className="text-sm font-medium">{chain.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, positive }: { icon: any; label: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold mb-1 tabular-nums transition-all duration-300">{value}</p>
      <p className={`text-xs tabular-nums ${positive ? "text-neon-green" : "text-destructive"}`}>{change}</p>
    </div>
  );
}
