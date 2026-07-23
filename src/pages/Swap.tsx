import { useState } from "react";
import { TOKENS, DEX_ROUTES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ArrowDown, Settings, Zap, CheckCircle, Loader2 } from "lucide-react";

export default function Swap() {
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("1.0");
  const [swapping, setSwapping] = useState(false);
  const [done, setDone] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  const fromT = TOKENS.find((t) => t.symbol === fromToken)!;
  const toT = TOKENS.find((t) => t.symbol === toToken)!;
  const outputAmount = (parseFloat(amount || "0") * fromT.price / toT.price).toFixed(2);

  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => { setSwapping(false); setDone(true); setTimeout(() => setDone(false), 3000); }, 2500);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Swap Tokens</h1>
        <p className="text-sm text-muted-foreground">DEX aggregation across multiple exchanges</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        {/* From */}
        <div className="bg-muted/40 rounded-xl p-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>From</span>
            <span>Balance: {fromT.balance.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-2xl font-bold w-full outline-none"
              placeholder="0.0"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-muted/60 rounded-lg px-3 py-2 text-sm font-medium outline-none border border-border/50"
            >
              {TOKENS.map((t) => <option key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</option>)}
            </select>
          </div>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={() => { setFromToken(toToken); setToToken(fromToken); }}
            className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <ArrowDown className="h-4 w-4 text-primary" />
          </button>
        </div>

        {/* To */}
        <div className="bg-muted/40 rounded-xl p-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>To</span>
            <span>Balance: {toT.balance.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-muted-foreground">{outputAmount}</span>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-muted/60 rounded-lg px-3 py-2 text-sm font-medium outline-none border border-border/50 ml-auto"
            >
              {TOKENS.map((t) => <option key={t.symbol} value={t.symbol}>{t.icon} {t.symbol}</option>)}
            </select>
          </div>
        </div>

        {/* Slippage */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Settings className="h-3 w-3" />
            Slippage
          </div>
          <div className="flex gap-1">
            {["0.1", "0.5", "1.0"].map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`px-2 py-1 rounded text-xs transition-colors ${slippage === s ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"}`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>

        {/* Swap Button */}
        <Button
          className="w-full gradient-primary text-primary-foreground font-semibold py-6 rounded-xl"
          onClick={handleSwap}
          disabled={swapping || !amount || parseFloat(amount) <= 0}
        >
          {swapping ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Swapping...</> :
           done ? <><CheckCircle className="h-4 w-4 mr-2" /> Swap Complete!</> :
           <><Zap className="h-4 w-4 mr-2" /> Swap</>}
        </Button>
      </div>

      {/* Route Comparison */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Best Routes Found
        </h3>
        <div className="space-y-2">
          {DEX_ROUTES.map((route, i) => (
            <div key={route.dex} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${i === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
              <div className="flex items-center gap-3">
                {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">Best</span>}
                <span className="text-sm font-medium">{route.dex}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{route.share}</span>
                <span>{route.gas}</span>
                <span className="font-mono">${route.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
