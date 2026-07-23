import { useState, useEffect, useRef } from "react";
import { Zap, AlertTriangle, CheckCircle2, ArrowRight, Shield, TrendingUp, Clock, Fuel, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  id: number;
  action: string;
  protocol: string;
  detail: string;
  gas: string;
  icon: string;
  status: "pending" | "active" | "done";
}

interface ParsedIntent {
  summary: string;
  steps: Step[];
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  riskWarnings: string[];
  estimatedGas: string;
  estimatedTime: string;
  expectedOutcome: string;
  confidence: number;
}

const EXAMPLE_INTENTS = [
  "I want to earn the best yield on 1000 USDC without locking it up",
  "Swap 2 ETH to USDC and bridge it to Polygon",
  "Ape into the hottest memecoin with 0.5 ETH",
  "Diversify my portfolio: 40% ETH, 30% BTC, 30% stablecoins",
  "Stake my ETH for liquid staking rewards",
];

function parseIntent(text: string): ParsedIntent {
  const lower = text.toLowerCase();

  if (lower.includes("yield") || lower.includes("earn")) {
    return {
      summary: "Deposit USDC into the highest-yield lending protocol with no lockup",
      steps: [
        { id: 1, action: "Approve USDC", protocol: "ERC-20", detail: "Grant spending approval for 1,000 USDC", gas: "$1.20", icon: "🔓", status: "pending" },
        { id: 2, action: "Compare Rates", protocol: "Aggregator", detail: "Aave 4.82% · Compound 5.14% · Yearn 7.23%", gas: "$0", icon: "📊", status: "pending" },
        { id: 3, action: "Deposit to Compound", protocol: "Compound V3", detail: "Deposit 1,000 USDC → receive cUSDCv3", gas: "$3.80", icon: "🏦", status: "pending" },
        { id: 4, action: "Verify Position", protocol: "Compound V3", detail: "Confirm 5.14% APY, no lockup, withdrawable anytime", gas: "$0", icon: "✅", status: "pending" },
      ],
      riskLevel: "low",
      riskScore: 15,
      riskWarnings: ["Smart contract risk — Compound has been audited 12 times", "APY is variable and may decrease"],
      estimatedGas: "$5.00",
      estimatedTime: "~30 seconds",
      expectedOutcome: "Earn 5.14% APY on 1,000 USDC with instant withdrawal",
      confidence: 94,
    };
  }

  if (lower.includes("swap") && lower.includes("bridge")) {
    return {
      summary: "Swap ETH → USDC on Ethereum, then bridge to Polygon via optimal route",
      steps: [
        { id: 1, action: "Swap ETH → USDC", protocol: "Uniswap V3", detail: "Swap 2 ETH → ~7,695 USDC at best rate", gas: "$4.20", icon: "🔄", status: "pending" },
        { id: 2, action: "Approve Bridge", protocol: "ERC-20", detail: "Approve USDC for bridge contract", gas: "$1.20", icon: "🔓", status: "pending" },
        { id: 3, action: "Bridge to Polygon", protocol: "Across Protocol", detail: "Bridge 7,695 USDC → Polygon (2-5 min, $1.50 fee)", gas: "$2.30", icon: "🌉", status: "pending" },
        { id: 4, action: "Confirm Receipt", protocol: "Polygon", detail: "Verify USDC arrived on Polygon", gas: "$0", icon: "✅", status: "pending" },
      ],
      riskLevel: "low",
      riskScore: 22,
      riskWarnings: ["Bridge transfers take 2-5 minutes", "Slippage tolerance set to 0.5%"],
      estimatedGas: "$7.70",
      estimatedTime: "~3-6 minutes",
      expectedOutcome: "~7,695 USDC on Polygon",
      confidence: 97,
    };
  }

  if (lower.includes("ape") || lower.includes("meme")) {
    return {
      summary: "⚠️ HIGH RISK: Purchase memecoin with 0.5 ETH",
      steps: [
        { id: 1, action: "Risk Assessment", protocol: "AI Scanner", detail: "Checking contract for honeypot, rug pull indicators", gas: "$0", icon: "🔍", status: "pending" },
        { id: 2, action: "Set Max Slippage", protocol: "DEX Router", detail: "Slippage set to 15% — high volatility expected", gas: "$0", icon: "⚠️", status: "pending" },
        { id: 3, action: "Swap ETH → MEME", protocol: "Uniswap V3", detail: "Swap 0.5 ETH → ~420,690 MEME tokens", gas: "$8.50", icon: "🎰", status: "pending" },
        { id: 4, action: "Set Stop-Loss", protocol: "Limit Order", detail: "Auto-sell if price drops 40% from entry", gas: "$0", icon: "🛡️", status: "pending" },
      ],
      riskLevel: "high",
      riskScore: 82,
      riskWarnings: [
        "🚨 This token has no verified audit",
        "Liquidity pool is only $45K — high slippage risk",
        "Top 10 wallets hold 67% of supply — whale dump risk",
        "You could lose your entire investment",
      ],
      estimatedGas: "$8.50",
      estimatedTime: "~15 seconds",
      expectedOutcome: "~420,690 MEME tokens (highly speculative)",
      confidence: 34,
    };
  }

  if (lower.includes("diversif")) {
    return {
      summary: "Rebalance portfolio to 40% ETH, 30% BTC, 30% stablecoins",
      steps: [
        { id: 1, action: "Analyze Portfolio", protocol: "Portfolio Engine", detail: "Current: 78% ETH, 12% BTC, 10% USDC", gas: "$0", icon: "📊", status: "pending" },
        { id: 2, action: "Swap ETH → BTC", protocol: "Uniswap V3", detail: "Swap 1.2 ETH → 0.047 WBTC", gas: "$4.20", icon: "🔄", status: "pending" },
        { id: 3, action: "Swap ETH → USDC", protocol: "Uniswap V3", detail: "Swap 0.8 ETH → 3,078 USDC", gas: "$4.20", icon: "🔄", status: "pending" },
        { id: 4, action: "Verify Balance", protocol: "Portfolio Engine", detail: "New: 40% ETH, 30% BTC, 30% USDC ✓", gas: "$0", icon: "✅", status: "pending" },
      ],
      riskLevel: "medium",
      riskScore: 35,
      riskWarnings: ["Two swaps required — gas costs ~$8.40", "BTC price may move during execution"],
      estimatedGas: "$8.40",
      estimatedTime: "~45 seconds",
      expectedOutcome: "Balanced portfolio: 40% ETH / 30% BTC / 30% USDC",
      confidence: 91,
    };
  }

  if (lower.includes("stak") || lower.includes("liquid")) {
    return {
      summary: "Stake ETH via Lido for liquid staking rewards (stETH)",
      steps: [
        { id: 1, action: "Check Rates", protocol: "Aggregator", detail: "Lido 3.85% · Rocket Pool 3.42% · Coinbase 3.1%", gas: "$0", icon: "📊", status: "pending" },
        { id: 2, action: "Stake ETH", protocol: "Lido", detail: "Deposit ETH → receive stETH (1:1 ratio)", gas: "$3.50", icon: "🌊", status: "pending" },
        { id: 3, action: "Verify stETH", protocol: "Lido", detail: "Confirm stETH balance, earning 3.85% APY", gas: "$0", icon: "✅", status: "pending" },
      ],
      riskLevel: "low",
      riskScore: 18,
      riskWarnings: ["stETH may trade at a slight discount to ETH", "Withdrawals may take 1-5 days during high demand"],
      estimatedGas: "$3.50",
      estimatedTime: "~20 seconds",
      expectedOutcome: "Earn 3.85% APY on staked ETH, remain liquid via stETH",
      confidence: 96,
    };
  }

  // Default fallback
  return {
    summary: `Execute: "${text}"`,
    steps: [
      { id: 1, action: "Parse Intent", protocol: "AI Engine", detail: "Analyzing your request...", gas: "$0", icon: "🧠", status: "pending" },
      { id: 2, action: "Find Best Route", protocol: "Aggregator", detail: "Searching optimal execution path", gas: "$0", icon: "🔍", status: "pending" },
      { id: 3, action: "Execute Transaction", protocol: "Smart Router", detail: "Executing via best available path", gas: "$4.00", icon: "⚡", status: "pending" },
    ],
    riskLevel: "medium",
    riskScore: 40,
    riskWarnings: ["Complex intent — please review execution plan carefully"],
    estimatedGas: "$4.00",
    estimatedTime: "~30 seconds",
    expectedOutcome: "Transaction executed as requested",
    confidence: 72,
  };
}

export default function WishExec() {
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ParsedIntent | null>(null);
  const [executing, setExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (text?: string) => {
    const intent = text || input;
    if (!intent.trim()) return;
    setInput(intent);
    setParsing(true);
    setResult(null);
    setExecuting(false);
    setActiveStep(-1);
    setCompletedSteps([]);

    setTimeout(() => {
      setResult(parseIntent(intent));
      setParsing(false);
    }, 1500);
  };

  const handleExecute = () => {
    if (!result) return;
    setExecuting(true);
    setActiveStep(0);

    result.steps.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i > 0) setCompletedSteps(prev => [...prev, i - 1]);
      }, i * 1800);
    });

    setTimeout(() => {
      setCompletedSteps(prev => [...prev, result.steps.length - 1]);
      setActiveStep(-1);
    }, result.steps.length * 1800);
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const riskColor = result?.riskLevel === "high"
    ? "text-red-400"
    : result?.riskLevel === "medium"
      ? "text-yellow-400"
      : "text-emerald-400";

  const riskBg = result?.riskLevel === "high"
    ? "bg-red-500/10 border-red-500/30"
    : result?.riskLevel === "medium"
      ? "bg-yellow-500/10 border-yellow-500/30"
      : "bg-emerald-500/10 border-emerald-500/30";

  const allDone = result && completedSteps.length === result.steps.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Zap className="h-3 w-3" />
          Intent-Based Execution Engine
        </div>
        <h1 className="text-3xl font-bold gradient-text">WishExec</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Tell us what you want in plain English. We'll figure out the best on-chain path and execute it for you.
        </p>
      </div>

      {/* Input */}
      <div className="glass-card p-4 space-y-3">
        <div className="relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder='Try: "I want to earn the best yield on 1000 USDC without locking it up"'
            className="w-full bg-background/50 border border-border/50 rounded-xl p-4 pr-12 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          />
          <Button
            size="icon"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || parsing}
            className="absolute bottom-3 right-3 h-8 w-8 rounded-lg"
          >
            {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_INTENTS.map((ex, i) => (
            <button
              key={i}
              onClick={() => { setInput(ex); handleSubmit(ex); }}
              className="text-xs px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors truncate max-w-[280px]"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Parsing state */}
      {parsing && (
        <div className="glass-card p-8 flex flex-col items-center gap-3 animate-pulse">
          <Sparkles className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Parsing your intent and finding the optimal route...</p>
        </div>
      )}

      {/* Result */}
      {result && !parsing && (
        <div ref={resultRef} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Summary */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Parsed Intent</p>
                <p className="text-sm font-semibold">{result.summary}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className={`text-sm font-bold tabular-nums ${result.confidence > 80 ? "text-emerald-400" : result.confidence > 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {result.confidence}%
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Fuel className="h-3 w-3" /> {result.estimatedGas}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {result.estimatedTime}</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {result.expectedOutcome}</span>
            </div>
          </div>

          {/* Execution Plan */}
          <div className="glass-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Execution Plan</p>
            {result.steps.map((step, i) => {
              const isDone = completedSteps.includes(i);
              const isActive = activeStep === i;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    isDone ? "bg-emerald-500/10 border border-emerald-500/20" :
                    isActive ? "bg-primary/10 border border-primary/30 scale-[1.01]" :
                    "bg-muted/20 border border-transparent"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-base shrink-0 transition-all ${
                    isDone ? "bg-emerald-500/20" : isActive ? "bg-primary/20 animate-pulse" : "bg-muted/30"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> :
                     isActive ? <Loader2 className="h-5 w-5 text-primary animate-spin" /> :
                     <span>{step.icon}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{step.action}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">{step.protocol}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{step.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">{step.gas}</span>
                </div>
              );
            })}
          </div>

          {/* Risk Assessment */}
          <div className={`rounded-xl border p-4 space-y-3 ${riskBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${riskColor}`} />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.riskLevel === "high" ? "bg-red-400" : result.riskLevel === "medium" ? "bg-yellow-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  />
                </div>
                <span className={`text-sm font-bold tabular-nums ${riskColor}`}>{result.riskScore}/100</span>
              </div>
            </div>
            {result.riskWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className={`h-3 w-3 mt-0.5 shrink-0 ${riskColor}`} />
                <span className="text-muted-foreground">{w}</span>
              </div>
            ))}
          </div>

          {/* Execute Button */}
          {!allDone && (
            <Button
              onClick={handleExecute}
              disabled={executing}
              className="w-full h-12 text-sm font-semibold gap-2"
              variant={result.riskLevel === "high" ? "destructive" : "default"}
            >
              {executing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Executing Step {activeStep + 1} of {result.steps.length}...</>
              ) : result.riskLevel === "high" ? (
                <><AlertTriangle className="h-4 w-4" /> I Understand the Risks — Execute Anyway</>
              ) : (
                <><Zap className="h-4 w-4" /> Execute Plan ({result.steps.length} steps)</>
              )}
            </Button>
          )}

          {allDone && (
            <div className="glass-card p-4 text-center space-y-2 border border-emerald-500/30 bg-emerald-500/5">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-emerald-400">All steps executed successfully!</p>
              <p className="text-xs text-muted-foreground">{result.expectedOutcome}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
