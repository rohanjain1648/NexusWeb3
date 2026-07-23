import { NFTS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Filter } from "lucide-react";
import { useState } from "react";

const rarityColors: Record<string, string> = {
  Common: "text-muted-foreground bg-muted/50",
  Uncommon: "text-neon-green bg-neon-green/10",
  Rare: "text-secondary bg-secondary/10",
  Epic: "text-neon-purple bg-neon-purple/10",
  Legendary: "text-neon-orange bg-neon-orange/10",
  Mythic: "text-neon-pink bg-neon-pink/10",
};

export default function NFTs() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "dynamic" ? NFTS.filter((n) => n.isDynamic) : filter === "static" ? NFTS.filter((n) => !n.isDynamic) : NFTS;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">NFT Gallery</h1>
          <p className="text-sm text-muted-foreground">Your NFT collection & marketplace</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/nfts/fractional")} className="border-border/50">
            <Sparkles className="h-4 w-4 mr-1" /> Fractional
          </Button>
          <Button size="sm" className="gradient-primary" onClick={() => navigate("/nfts/mint")}>
            <Plus className="h-4 w-4 mr-1" /> Mint NFT
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "dynamic", "static"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${filter === f ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"}`}>
            {f === "dynamic" && "⚡ "}{f}
          </button>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((nft) => (
          <div key={nft.id} className="glass-card-hover overflow-hidden group">
            <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
              {nft.image}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{nft.name}</h3>
                {nft.isDynamic && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan animate-pulse-slow">⚡ Dynamic</span>}
              </div>
              <p className="text-xs text-muted-foreground">{nft.collection}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{nft.price}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${rarityColors[nft.rarity]}`}>{nft.rarity}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full border-border/50 text-xs">
                Buy Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
