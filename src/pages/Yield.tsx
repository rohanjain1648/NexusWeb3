import { YIELD_PROTOCOLS, PORTFOLIO_HISTORY } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const riskColors: Record<string, string> = {
  Low: "text-neon-green bg-neon-green/10",
  Medium: "text-neon-orange bg-neon-orange/10",
  High: "text-destructive bg-destructive/10",
};

const yieldHistory = PORTFOLIO_HISTORY.map((d, i) => ({
  ...d,
  apy: 4 + Math.sin(i * 0.3) * 2 + Math.random(),
}));

export default function Yield() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Yield Aggregator</h1>
        <p className="text-sm text-muted-foreground">Compare and stake across DeFi protocols</p>
      </div>

      {/* Yield Chart */}
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-4">Average APY Trend (30d)</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yieldHistory}>
              <defs>
                <linearGradient id="apyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(170, 80%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(170, 80%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`} />
              <Tooltip contentStyle={{ background: "hsl(230, 25%, 11%)", border: "1px solid hsl(230, 20%, 18%)", borderRadius: 12, color: "hsl(210, 40%, 96%)" }} />
              <Area type="monotone" dataKey="apy" stroke="hsl(170, 80%, 45%)" fill="url(#apyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Protocol Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium">Protocol</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Token</th>
                <th className="text-left p-4 text-muted-foreground font-medium">APY</th>
                <th className="text-left p-4 text-muted-foreground font-medium">TVL</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Risk</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Chain</th>
                <th className="text-right p-4 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {YIELD_PROTOCOLS.map((p) => (
                <tr key={p.name} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-2"><span className="text-xl">{p.icon}</span>{p.name}</td>
                  <td className="p-4">{p.token}</td>
                  <td className="p-4 font-bold text-neon-green">{p.apy}%</td>
                  <td className="p-4 text-muted-foreground">{p.tvl}</td>
                  <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[p.risk]}`}>{p.risk}</span></td>
                  <td className="p-4 text-muted-foreground">{p.chain}</td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">Stake</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
