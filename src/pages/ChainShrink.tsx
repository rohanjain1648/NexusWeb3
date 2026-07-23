import { useState, useEffect } from "react";
import {
  Brain, Shield, TrendingUp, AlertTriangle, CheckCircle2,
  Activity, Target, Flame, Gem, Zap, BarChart3, PieChart,
  ArrowUpRight, ArrowDownRight, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/contexts/WalletContext";

/* ── Archetypes ── */
const ARCHETYPES = [
  { id: "hodler", label: "Diamond-Hand Hodler", emoji: "💎", color: "text-cyan-400", desc: "You buy and hold through everything. Patience is your superpower." },
  { id: "degen", label: "Degen Flipper", emoji: "🎰", color: "text-red-400", desc: "High frequency, high risk. You chase momentum and live for the thrill." },
  { id: "yield", label: "Yield Maximalist", emoji: "🌾", color: "text-emerald-400", desc: "APY is your north star. You farm, stake, and compound relentlessly." },
  { id: "collector", label: "NFT Collector", emoji: "🖼️", color: "text-purple-400", desc: "You curate digital art & collectibles. Your wallet is a gallery." },
  { id: "whale", label: "Silent Whale", emoji: "🐋", color: "text-blue-400", desc: "Few trades, big size. You move markets without making noise." },
];

/* ── Mock analysis data ── */
const MOCK_ANALYSIS = {
  archetype: ARCHETYPES[2], // Yield Maximalist
  healthScore: 72,
  healthBreakdown: [
    { label: "Diversification", score: 65, icon: PieChart },
    { label: "Risk Exposure", score: 78, icon: Shield },
    { label: "Gas Efficiency", score: 58, icon: Flame },
    { label: "Protocol Safety", score: 88, icon: CheckCircle2 },
  ],
  bestTrades: [
    { token: "ETH", action: "Bought", entry: "$1,820", exit: "$3,847", pnl: "+$8,514", pnlPercent: "+111%", date: "Mar 2024" },
    { token: "LINK", action: "Bought", entry: "$6.20", exit: "$18.45", pnl: "+$1,837", pnlPercent: "+198%", date: "Jan 2024" },
    { token: "ARB", action: "Bought", entry: "$0.42", exit: "$1.23", pnl: "+$4,050", pnlPercent: "+193%", date: "Nov 2023" },
  ],
  worstTrades: [
    { token: "LUNA", action: "Bought", entry: "$82.00", exit: "$0.0001", pnl: "-$4,100", pnlPercent: "-99.9%", date: "May 2022" },
    { token: "FTT", action: "Bought", entry: "$24.50", exit: "$1.30", pnl: "-$2,320", pnlPercent: "-94.7%", date: "Nov 2022" },
    { token: "JPEG", action: "Minted", entry: "0.15 ETH", exit: "0.01 ETH", pnl: "-$538", pnlPercent: "-93.3%", date: "Aug 2023" },
  ],
  patterns: [
    { icon: "📈", text: "You buy altcoins when BTC is up 5%+ — this has a 38% win rate historically" },
    { icon: "⏰", text: "68% of your swaps happen between 2-4 AM UTC — peak gas hours" },
    { icon: "🔄", text: "You rotate yield farms every 11 days on average — $847 in unnecessary gas" },
    { icon: "💎", text: "Your average ETH hold time is 147 days — top 15% of holders" },
    { icon: "🎯", text: "You take profit at 2.1x on average — but your stops are at -60%" },
  ],
  stats: {
    totalTxns: 1247,
    totalGasSpent: "$3,847",
    uniqueProtocols: 23,
    totalPnl: "+$12,843",
    portfolioCorrelation: "87% to ETH",
    avgHoldTime: "43 days",
  },
  recommendations: [
    { priority: "high", text: "Your portfolio is 87% correlated to ETH — consider hedging with BTC or stablecoins", icon: AlertTriangle },
    { priority: "high", text: "You've wasted ~$847 on gas from farm-hopping — batch transactions or use L2s", icon: Flame },
    { priority: "medium", text: "Set tighter stop-losses — your avg loss (-82%) far exceeds avg win (+167%)", icon: Target },
    { priority: "medium", text: "Move 20% to uncorrelated assets (RWA tokens, BTC) to reduce drawdown risk", icon: PieChart },
    { priority: "low", text: "Your Aave health factor is 1.8 — consider repaying to 2.5+ before next volatility event", icon: Shield },
  ],
};

/* ── Animated counter ── */
function AnimatedScore({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span className="tabular-nums">{val}</span>;
}

/* ── Score ring ── */
function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "stroke-emerald-400" : score >= 60 ? "stroke-yellow-400" : "stroke-red-400";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-muted/20" />
        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className={color}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold"><AnimatedScore target={score} /></span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Health</span>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function ChainShrink() {
  const { address, ensName } = useWallet();
  const [scanning, setScanning] = useState(false);
  const [analysis, setAnalysis] = useState<typeof MOCK_ANALYSIS | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLabel, setScanLabel] = useState("");

  const scanSteps = [
    "Fetching transaction history...",
    "Analyzing swap patterns...",
    "Scanning DeFi positions...",
    "Evaluating NFT activity...",
    "Classifying wallet archetype...",
    "Computing DeFi health score...",
    "Generating recommendations...",
  ];

  const handleScan = () => {
    setScanning(true);
    setAnalysis(null);
    setScanProgress(0);

    scanSteps.forEach((label, i) => {
      setTimeout(() => {
        setScanLabel(label);
        setScanProgress(Math.round(((i + 1) / scanSteps.length) * 100));
      }, i * 600);
    });

    setTimeout(() => {
      setScanning(false);
      setAnalysis(MOCK_ANALYSIS);
    }, scanSteps.length * 600 + 400);
  };

  const priorityColor = (p: string) =>
    p === "high" ? "text-red-400 bg-red-500/10 border-red-500/20" :
    p === "medium" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" :
    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Brain className="h-3 w-3" />
          AI Wallet Forensics
        </div>
        <h1 className="text-3xl font-bold gradient-text">Chain Shrink</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Your on-chain financial therapist. Analyzing behavior, patterns, and health of your wallet.
        </p>
      </div>

      {/* Scan card */}
      <div className="glass-card p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">🦊</div>
          <div className="text-left">
            <p className="text-sm font-semibold">{ensName || address}</p>
            <p className="text-xs text-muted-foreground">{address}</p>
          </div>
        </div>

        {scanning ? (
          <div className="space-y-3 max-w-sm mx-auto">
            <Progress value={scanProgress} className="h-2" />
            <p className="text-xs text-muted-foreground animate-pulse">{scanLabel}</p>
          </div>
        ) : (
          <Button onClick={handleScan} className="gap-2" disabled={!!analysis}>
            {analysis ? <><CheckCircle2 className="h-4 w-4" /> Scan Complete</> : <><Activity className="h-4 w-4" /> Analyze Wallet</>}
          </Button>
        )}

        {analysis && (
          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setAnalysis(null); handleScan(); }}>
            <RefreshCw className="h-3 w-3" /> Re-scan
          </Button>
        )}
      </div>

      {/* Results */}
      {analysis && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Archetype */}
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="text-5xl">{analysis.archetype.emoji}</div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Archetype</p>
              <p className={`text-xl font-bold ${analysis.archetype.color}`}>{analysis.archetype.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{analysis.archetype.desc}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {([
              ["Transactions", analysis.stats.totalTxns.toLocaleString(), Activity],
              ["Gas Spent", analysis.stats.totalGasSpent, Flame],
              ["Protocols", analysis.stats.uniqueProtocols.toString(), Zap],
              ["Total P&L", analysis.stats.totalPnl, TrendingUp],
              ["ETH Correlation", analysis.stats.portfolioCorrelation, BarChart3],
              ["Avg Hold", analysis.stats.avgHoldTime, Target],
            ] as const).map(([label, value, Icon]) => (
              <div key={label} className="glass-card p-3 text-center space-y-1">
                <Icon className="h-4 w-4 mx-auto text-muted-foreground" />
                <p className="text-sm font-semibold tabular-nums">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Health Score + Breakdown */}
          <div className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">DeFi Health Score</p>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ScoreRing score={analysis.healthScore} />
              <div className="flex-1 space-y-3 w-full">
                {analysis.healthBreakdown.map(b => (
                  <div key={b.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <b.icon className="h-3 w-3" /> {b.label}
                      </span>
                      <span className="font-medium tabular-nums">{b.score}/100</span>
                    </div>
                    <Progress value={b.score} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Best & Worst Trades */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Best Trades</p>
              </div>
              {analysis.bestTrades.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div>
                    <p className="text-sm font-medium">{t.token} <span className="text-muted-foreground text-xs">· {t.date}</span></p>
                    <p className="text-xs text-muted-foreground">{t.entry} → {t.exit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400 tabular-nums">{t.pnl}</p>
                    <p className="text-xs text-emerald-400/70 tabular-nums">{t.pnlPercent}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-red-400" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Worst Trades</p>
              </div>
              {analysis.worstTrades.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div>
                    <p className="text-sm font-medium">{t.token} <span className="text-muted-foreground text-xs">· {t.date}</span></p>
                    <p className="text-xs text-muted-foreground">{t.entry} → {t.exit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400 tabular-nums">{t.pnl}</p>
                    <p className="text-xs text-red-400/70 tabular-nums">{t.pnlPercent}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Patterns */}
          <div className="glass-card p-4 space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Behavioral Patterns</p>
            {analysis.patterns.map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/20">
                <span className="text-base mt-0.5">{p.icon}</span>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI Recommendations</p>
            </div>
            {analysis.recommendations.map((r, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${priorityColor(r.priority)}`}>
                <r.icon className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{r.text}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-medium shrink-0 opacity-70">{r.priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
