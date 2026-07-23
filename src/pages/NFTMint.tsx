import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Upload, Sparkles, Loader2, CheckCircle } from "lucide-react";

export default function NFTMint() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDynamic, setIsDynamic] = useState(false);
  const [oracleSource, setOracleSource] = useState("weather");
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleMint = () => {
    setMinting(true);
    setTimeout(() => { setMinting(false); setMinted(true); }, 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Mint New NFT</h1>
        <p className="text-sm text-muted-foreground">Create static or dynamic (oracle-driven) NFTs</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click or drag to upload media</p>
          <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, GIF, SVG, MP4 • Max 100MB</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Amazing NFT" className="bg-muted/40 border-border/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your NFT..." className="w-full bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-sm outline-none min-h-[80px] focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {/* Dynamic NFT Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neon-cyan" />
            <div>
              <p className="text-sm font-medium">Dynamic NFT</p>
              <p className="text-xs text-muted-foreground">Auto-updates via oracle data</p>
            </div>
          </div>
          <Switch checked={isDynamic} onCheckedChange={setIsDynamic} />
        </div>

        {isDynamic && (
          <div className="p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 space-y-3 animate-fade-in">
            <label className="text-xs text-muted-foreground mb-1 block">Oracle Data Source</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "weather", label: "🌤️ Weather", desc: "Live weather data" },
                { value: "sports", label: "⚽ Sports", desc: "Game scores" },
                { value: "price", label: "📈 Price", desc: "Token prices" },
              ].map((o) => (
                <button
                  key={o.value}
                  onClick={() => setOracleSource(o.value)}
                  className={`p-3 rounded-lg text-center text-xs transition-colors ${oracleSource === o.value ? "bg-neon-cyan/20 border border-neon-cyan/30" : "bg-muted/40"}`}
                >
                  <div className="text-lg mb-1">{o.label.split(" ")[0]}</div>
                  <div className="text-muted-foreground">{o.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full gradient-primary text-primary-foreground font-semibold py-6 rounded-xl" onClick={handleMint} disabled={minting || !name}>
          {minting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Minting on IPFS...</> :
           minted ? <><CheckCircle className="h-4 w-4 mr-2" /> NFT Minted! 🎉</> :
           "Mint NFT"}
        </Button>
      </div>
    </div>
  );
}
