import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeftRight, Palette, Waves, Globe, AlertTriangle,
  Zap, Eye, EyeOff, TrendingUp, Flame, Diamond, Clock,
  Activity, Radio
} from "lucide-react";

/* ─── types ─── */
interface StoryTx {
  id: string;
  type: "swap" | "mint" | "bridge" | "transfer" | "liquidation";
  from: string;
  to: string;
  value: number;
  token: string;
  chain: string;
  status: "pending" | "confirmed";
  timestamp: number;
  isWhale: boolean;
  gasGwei: number;
}

interface BreakingEvent {
  id: string;
  text: string;
  severity: "info" | "warning" | "critical";
  time: number;
}

/* ─── generators ─── */
const CHAINS = ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"];
const TOKENS = ["ETH", "USDC", "WBTC", "LINK", "UNI", "AAVE", "MATIC", "ARB", "OP"];
const WALLETS = [
  "0x3eD4...c5E1", "0x9f1A...7bC2", "0x5b2F...d8A3", "0xaB12...eF45",
  "0x7cD8...3a91", "0xf0E2...6b78", "0x1d4F...9c23", "0x8a6B...4e5D",
];
const WHALE_WALLETS = ["0xdead...beef", "0xcafe...babe", "0xf00d...face"];

const BREAKING_TEMPLATES = [
  { text: "🐋 Whale moved {v} {t} on {c}", severity: "critical" as const },
  { text: "⚠️ Large LP withdrawal detected on {c} — rug risk elevated", severity: "warning" as const },
  { text: "🔥 Gas spike to {g} gwei on Ethereum mainnet", severity: "warning" as const },
  { text: "📈 {t} volume surged 340% in last 5 minutes", severity: "info" as const },
  { text: "💀 Liquidation cascade: {v} {t} wiped on Aave", severity: "critical" as const },
  { text: "🚀 Smart money accumulating {t} — 12 wallets bought in 2 min", severity: "info" as const },
];

function randomTx(): StoryTx {
  const types: StoryTx["type"][] = ["swap", "mint", "bridge", "transfer", "liquidation"];
  const type = types[Math.floor(Math.random() * types.length)];
  const isWhale = Math.random() < 0.08;
  const value = isWhale
    ? +(Math.random() * 2000 + 500).toFixed(2)
    : +(Math.random() * 50 + 0.01).toFixed(4);
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    from: isWhale ? WHALE_WALLETS[Math.floor(Math.random() * WHALE_WALLETS.length)] : WALLETS[Math.floor(Math.random() * WALLETS.length)],
    to: WALLETS[Math.floor(Math.random() * WALLETS.length)],
    value,
    token: TOKENS[Math.floor(Math.random() * TOKENS.length)],
    chain: CHAINS[Math.floor(Math.random() * CHAINS.length)],
    status: Math.random() < 0.3 ? "pending" : "confirmed",
    timestamp: Date.now(),
    isWhale,
    gasGwei: Math.floor(Math.random() * 80 + 12),
  };
}

function randomBreaking(): BreakingEvent {
  const t = BREAKING_TEMPLATES[Math.floor(Math.random() * BREAKING_TEMPLATES.length)];
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const chain = CHAINS[Math.floor(Math.random() * CHAINS.length)];
  const val = (Math.random() * 3000 + 200).toFixed(0);
  const gas = Math.floor(Math.random() * 200 + 80);
  return {
    id: `ev-${Date.now()}`,
    text: t.text.replace("{v}", val).replace("{t}", token).replace("{c}", chain).replace("{g}", String(gas)),
    severity: t.severity,
    time: Date.now(),
  };
}

/* ─── icon map ─── */
const typeConfig: Record<StoryTx["type"], { icon: any; label: string; color: string }> = {
  swap: { icon: ArrowLeftRight, label: "Swap", color: "text-primary bg-primary/10" },
  mint: { icon: Palette, label: "Mint", color: "text-neon-cyan bg-neon-cyan/10" },
  bridge: { icon: Globe, label: "Bridge", color: "text-secondary bg-secondary/10" },
  transfer: { icon: Waves, label: "Transfer", color: "text-neon-green bg-neon-green/10" },
  liquidation: { icon: Flame, label: "Liquidation", color: "text-destructive bg-destructive/10" },
};

const severityStyle: Record<string, string> = {
  info: "border-secondary/40 bg-secondary/5 text-secondary",
  warning: "border-neon-orange/40 bg-neon-orange/5 text-neon-orange",
  critical: "border-destructive/40 bg-destructive/5 text-destructive",
};

/* ─── story card ─── */
function StoryCard({ tx }: { tx: StoryTx }) {
  const cfg = typeConfig[tx.type];
  const Icon = cfg.icon;
  const age = Math.max(0, Math.floor((Date.now() - tx.timestamp) / 1000));

  return (
    <div className={`glass-card p-4 animate-fade-in transition-all ${tx.isWhale ? "ring-1 ring-neon-orange/50 shadow-[0_0_20px_hsl(25_95%_55%/0.15)]" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{cfg.label}</span>
            {tx.isWhale && (
              <Badge variant="outline" className="text-[10px] border-neon-orange/50 text-neon-orange gap-1">
                <Diamond className="h-3 w-3" /> Whale
              </Badge>
            )}
            <Badge variant="outline" className={`text-[10px] ${tx.status === "pending" ? "border-neon-orange/40 text-neon-orange" : "border-neon-green/40 text-neon-green"}`}>
              {tx.status === "pending" ? <Clock className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              {tx.status}
            </Badge>
          </div>

          {tx.type === "swap" && (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{tx.from}</span> swapped{" "}
              <span className="text-foreground font-medium">{tx.value} {tx.token}</span> → {TOKENS[Math.floor(Math.random() * TOKENS.length)]}
            </p>
          )}
          {tx.type === "mint" && (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{tx.from}</span> minted{" "}
              <span className="text-foreground font-medium">{tx.value} NFT</span> for {tx.value} {tx.token}
            </p>
          )}
          {tx.type === "bridge" && (
            <p className="text-sm text-muted-foreground">
              Bridged <span className="text-foreground font-medium">{tx.value} {tx.token}</span>{" "}
              {tx.chain} → {CHAINS[Math.floor(Math.random() * CHAINS.length)]}
            </p>
          )}
          {tx.type === "transfer" && (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{tx.from}</span> sent{" "}
              <span className="text-foreground font-medium">{tx.value} {tx.token}</span> to {tx.to}
            </p>
          )}
          {tx.type === "liquidation" && (
            <p className="text-sm text-muted-foreground">
              <span className="text-destructive font-medium">{tx.from}</span> liquidated —{" "}
              <span className="text-foreground font-medium">{tx.value} {tx.token}</span> seized
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{tx.chain}</span>
            <span>·</span>
            <span>{tx.gasGwei} gwei</span>
            <span>·</span>
            <span>{age < 60 ? `${age}s ago` : `${Math.floor(age / 60)}m ago`}</span>
          </div>
        </div>
        <span className="text-sm font-bold shrink-0">
          ${tx.value < 1 ? tx.value.toFixed(4) : tx.value.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* ─── main ─── */
export default function MempoolStories() {
  const [txs, setTxs] = useState<StoryTx[]>([]);
  const [events, setEvents] = useState<BreakingEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<StoryTx["type"] | "all" | "whale">("all");
  const [tps, setTps] = useState(0);
  const tpsRef = useRef(0);
  const tickerRef = useRef<HTMLDivElement>(null);

  // stream txs
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const newTxs = Array.from({ length: count }, randomTx);
      tpsRef.current += count;
      setTxs(prev => [...newTxs, ...prev].slice(0, 60));
    }, 1200);
    return () => clearInterval(id);
  }, [paused]);

  // breaking events
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setEvents(prev => [randomBreaking(), ...prev].slice(0, 12));
    }, 6000);
    return () => clearInterval(id);
  }, [paused]);

  // tps counter
  useEffect(() => {
    const id = setInterval(() => {
      setTps(tpsRef.current);
      tpsRef.current = 0;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = filter === "all"
    ? txs
    : filter === "whale"
      ? txs.filter(t => t.isWhale)
      : txs.filter(t => t.type === filter);

  const whaleCount = txs.filter(t => t.isWhale).length;
  const pendingCount = txs.filter(t => t.status === "pending").length;
  const totalValue = txs.reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Radio className="h-5 w-5 text-destructive animate-pulse" />
            Mempool Stories
          </h1>
          <p className="text-sm text-muted-foreground">Live on-chain narratives, visualized in real time</p>
        </div>
        <button
          onClick={() => setPaused(p => !p)}
          className="glass-card px-4 py-2 text-sm flex items-center gap-2 hover:bg-muted/40 transition-colors"
        >
          {paused ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      {/* breaking ticker */}
      {events.length > 0 && (
        <div className="overflow-hidden glass-card py-2 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Badge variant="outline" className="shrink-0 border-destructive/50 text-destructive text-[10px] gap-1">
              <AlertTriangle className="h-3 w-3" /> BREAKING
            </Badge>
            <div className="overflow-hidden flex-1 relative h-5">
              <div
                ref={tickerRef}
                className="absolute whitespace-nowrap flex gap-8"
                style={{ animation: "marquee 30s linear infinite" }}
              >
                {[...events, ...events].map((ev, i) => (
                  <span key={`${ev.id}-${i}`} className={`text-xs ${ev.severity === "critical" ? "text-destructive" : ev.severity === "warning" ? "text-neon-orange" : "text-secondary"}`}>
                    {ev.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Live TPS", value: tps, icon: Activity, accent: "text-primary" },
          { label: "Pending", value: pendingCount, icon: Clock, accent: "text-neon-orange" },
          { label: "Whale Txns", value: whaleCount, icon: Diamond, accent: "text-neon-cyan" },
          { label: "Volume", value: `$${totalValue < 1000 ? totalValue.toFixed(0) : (totalValue / 1000).toFixed(1) + "k"}`, icon: TrendingUp, accent: "text-neon-green" },
        ].map(s => {
          const I = s.icon;
          return (
            <div key={s.label} className="glass-card p-3 flex items-center gap-3">
              <I className={`h-4 w-4 ${s.accent}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "swap", "mint", "bridge", "transfer", "liquidation", "whale"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${filter === f ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"}`}
          >
            {f === "whale" ? "🐋 Whales" : f}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* story feed */}
        <div className="lg:col-span-2">
          <ScrollArea className="h-[600px] pr-2">
            <div className="space-y-2">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-12">
                  {paused ? "Stream paused — click Resume" : "Waiting for transactions..."}
                </p>
              )}
              {filtered.map(tx => (
                <StoryCard key={tx.id} tx={tx} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* side panel */}
        <div className="space-y-4">
          {/* recent breaking events */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Breaking Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[240px]">
                <div className="space-y-2">
                  {events.slice(0, 8).map(ev => (
                    <div key={ev.id} className={`rounded-lg border p-3 text-xs ${severityStyle[ev.severity]}`}>
                      {ev.text}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* chain activity */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Chain Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CHAINS.map(chain => {
                const count = txs.filter(t => t.chain === chain).length;
                const pct = txs.length ? Math.round((count / txs.length) * 100) : 0;
                return (
                  <div key={chain} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{chain}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5 bg-muted/40" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
