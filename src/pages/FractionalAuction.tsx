import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gem, Clock, Users, TrendingDown } from "lucide-react";

const auction = {
  nft: { name: "Crystal Dragon #23", image: "🐉", collection: "Mythical Beasts", totalValue: "50 ETH" },
  totalShares: 1000,
  sharesSold: 687,
  startPrice: "0.08 ETH",
  currentPrice: "0.052 ETH",
  endPrice: "0.02 ETH",
  participants: 142,
  endsIn: 3600 * 4 + 1800,
};

export default function FractionalAuction() {
  const [timeLeft, setTimeLeft] = useState(auction.endsIn);
  const [shares, setShares] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Fractional NFT Auction</h1>
        <p className="text-sm text-muted-foreground">Dutch auction — price decreases over time</p>
      </div>

      {/* NFT Preview */}
      <div className="glass-card overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-neon-pink/20 via-primary/10 to-neon-cyan/20 flex items-center justify-center text-8xl">
          {auction.nft.image}
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold">{auction.nft.name}</h2>
          <p className="text-sm text-muted-foreground">{auction.nft.collection} • Total Value: {auction.nft.totalValue}</p>
        </div>
      </div>

      {/* Auction Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Clock className="h-5 w-5 mx-auto mb-2 text-neon-orange" />
          <p className="text-lg font-bold font-mono">{String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</p>
          <p className="text-xs text-muted-foreground">Time Left</p>
        </div>
        <div className="glass-card p-4 text-center">
          <TrendingDown className="h-5 w-5 mx-auto mb-2 text-primary" />
          <p className="text-lg font-bold">{auction.currentPrice}</p>
          <p className="text-xs text-muted-foreground">Current Price/Share</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Users className="h-5 w-5 mx-auto mb-2 text-secondary" />
          <p className="text-lg font-bold">{auction.participants}</p>
          <p className="text-xs text-muted-foreground">Participants</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Gem className="h-5 w-5 mx-auto mb-2 text-neon-cyan" />
          <p className="text-lg font-bold">{auction.totalShares - auction.sharesSold}</p>
          <p className="text-xs text-muted-foreground">Shares Left</p>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-card p-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Shares Sold</span>
          <span className="font-bold">{auction.sharesSold}/{auction.totalShares}</span>
        </div>
        <Progress value={(auction.sharesSold / auction.totalShares) * 100} className="h-3" />
      </div>

      {/* Buy Shares */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-semibold">Buy Shares</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Number of Shares</label>
            <input type="number" value={shares} onChange={(e) => setShares(parseInt(e.target.value) || 0)} className="w-full bg-muted/40 rounded-xl px-4 py-3 text-lg font-bold outline-none border border-border/50" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="text-lg font-bold text-primary">{(shares * 0.052).toFixed(3)} ETH</p>
          </div>
        </div>
        <Button className="w-full gradient-primary text-primary-foreground font-semibold py-6 rounded-xl">
          Buy {shares} Shares
        </Button>
      </div>
    </div>
  );
}
