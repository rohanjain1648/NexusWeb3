import { useState, useEffect } from "react";
import { FEED_ITEMS } from "@/lib/mockData";
import { ArrowLeftRight, Palette, Vote, Waves, Globe, Filter } from "lucide-react";

const typeIcons: Record<string, { icon: any; color: string }> = {
  swap: { icon: ArrowLeftRight, color: "text-primary bg-primary/10" },
  mint: { icon: Palette, color: "text-neon-cyan bg-neon-cyan/10" },
  vote: { icon: Vote, color: "text-neon-orange bg-neon-orange/10" },
  stream: { icon: Waves, color: "text-neon-green bg-neon-green/10" },
  bridge: { icon: Globe, color: "text-secondary bg-secondary/10" },
};

export default function Feed() {
  const [items, setItems] = useState(FEED_ITEMS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["swap", "mint", "vote", "stream", "bridge"] as const;
      const type = types[Math.floor(Math.random() * types.length)];
      const newItem = {
        id: `f${Date.now()}`,
        type,
        user: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        action: `${type === "swap" ? "Swapped" : type === "mint" ? "Minted" : type === "vote" ? "Voted on" : type === "stream" ? "Started stream" : "Bridged"} ...`,
        time: "just now",
        value: `${(Math.random() * 10).toFixed(2)} ETH`,
      };
      setItems((prev) => [newItem, ...prev].slice(0, 20));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Live Feed</h1>
        <p className="text-sm text-muted-foreground">Real-time on-chain activity</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "swap", "mint", "vote", "stream", "bridge"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${filter === f ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item) => {
          const typeInfo = typeIcons[item.type] || typeIcons.swap;
          const Icon = typeInfo.icon;
          return (
            <div key={item.id} className="glass-card p-4 flex items-center gap-4 animate-fade-in">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm"><span className="font-medium text-primary">{item.user}</span>{" "}{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className="text-sm font-medium shrink-0">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
