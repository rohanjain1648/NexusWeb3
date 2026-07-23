import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Shield, ShieldAlert, ShieldCheck, Eye, X, Users, Link2, AlertTriangle, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface GraphNode {
  id: string;
  label: string;
  address: string;
  trustScore: number;
  sybilRisk: "low" | "medium" | "high";
  attestations: number;
  connections: string[];
  type: "wallet" | "contract" | "dao" | "whale";
  activity: string;
  x: number;
  y: number;
}

interface Attestation {
  from: string;
  to: string;
  type: string;
  date: string;
  weight: number;
}

const NODES: GraphNode[] = [
  { id: "n1", label: "vitalik.eth", address: "0x7a25...F3e8", trustScore: 96, sybilRisk: "low", attestations: 142, connections: ["n2","n3","n4","n5","n8"], type: "wallet", activity: "High — 1,247 txns", x: 400, y: 300 },
  { id: "n2", label: "whale.eth", address: "0x28C6...9a3F", trustScore: 88, sybilRisk: "low", attestations: 87, connections: ["n1","n3","n6","n9"], type: "whale", activity: "Very High — 3,891 txns", x: 220, y: 160 },
  { id: "n3", label: "defi_king", address: "0x9f1A...7bC2", trustScore: 72, sybilRisk: "medium", attestations: 34, connections: ["n1","n2","n7","n10"], type: "wallet", activity: "Medium — 456 txns", x: 580, y: 180 },
  { id: "n4", label: "nft_flip", address: "0x3eD4...c5E1", trustScore: 45, sybilRisk: "high", attestations: 8, connections: ["n1","n5"], type: "wallet", activity: "Low — 89 txns", x: 160, y: 420 },
  { id: "n5", label: "alice.eth", address: "0x4e2c...b7d1", trustScore: 91, sybilRisk: "low", attestations: 104, connections: ["n1","n4","n6","n8"], type: "wallet", activity: "High — 982 txns", x: 600, y: 400 },
  { id: "n6", label: "Uniswap V3", address: "0x1F98...C2d6", trustScore: 99, sybilRisk: "low", attestations: 0, connections: ["n2","n5","n7","n9"], type: "contract", activity: "Protocol — 12.4M txns", x: 340, y: 130 },
  { id: "n7", label: "Aave DAO", address: "0x7Fc6...3aB1", trustScore: 97, sybilRisk: "low", attestations: 0, connections: ["n3","n6","n10"], type: "dao", activity: "DAO — 2,341 proposals", x: 680, y: 280 },
  { id: "n8", label: "bob.eth", address: "0x8b3a...a2c4", trustScore: 83, sybilRisk: "low", attestations: 56, connections: ["n1","n5","n10"], type: "wallet", activity: "Medium — 634 txns", x: 500, y: 500 },
  { id: "n9", label: "suspicious_0x", address: "0xdEaD...bEEf", trustScore: 12, sybilRisk: "high", attestations: 1, connections: ["n2","n6"], type: "wallet", activity: "Very Low — 14 txns", x: 120, y: 260 },
  { id: "n10", label: "yield_farm", address: "0x5b2F...d8A3", trustScore: 67, sybilRisk: "medium", attestations: 23, connections: ["n3","n7","n8"], type: "wallet", activity: "Medium — 345 txns", x: 720, y: 460 },
];

const ATTESTATIONS: Attestation[] = [
  { from: "n1", to: "n2", type: "Mutual Trust", date: "2024-01-15", weight: 0.9 },
  { from: "n1", to: "n5", type: "Vouched", date: "2024-02-20", weight: 0.85 },
  { from: "n2", to: "n6", type: "Frequent User", date: "2024-03-01", weight: 0.7 },
  { from: "n5", to: "n8", type: "Mutual Trust", date: "2024-01-30", weight: 0.8 },
  { from: "n3", to: "n7", type: "DAO Member", date: "2024-02-10", weight: 0.75 },
];

const nodeColor = (node: GraphNode) => {
  if (node.type === "contract") return "hsl(var(--neon-cyan))";
  if (node.type === "dao") return "hsl(var(--neon-green))";
  if (node.type === "whale") return "hsl(var(--neon-orange))";
  if (node.trustScore >= 80) return "hsl(var(--neon-green))";
  if (node.trustScore >= 50) return "hsl(var(--chart-5))";
  return "hsl(var(--destructive))";
};

const nodeRadius = (node: GraphNode) => {
  if (node.type === "contract" || node.type === "dao") return 28;
  if (node.type === "whale") return 24;
  return 16 + (node.trustScore / 100) * 10;
};

const sybilBadge = (risk: GraphNode["sybilRisk"]) => {
  if (risk === "low") return { label: "Safe", variant: "default" as const, cls: "bg-[hsl(var(--neon-green))]/20 text-[hsl(var(--neon-green))] border-[hsl(var(--neon-green))]/30" };
  if (risk === "medium") return { label: "Caution", variant: "secondary" as const, cls: "bg-[hsl(var(--chart-5))]/20 text-[hsl(var(--chart-5))] border-[hsl(var(--chart-5))]/30" };
  return { label: "Flagged", variant: "destructive" as const, cls: "bg-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/30" };
};

const typeIcon = (type: GraphNode["type"]) => {
  if (type === "contract") return "📜";
  if (type === "dao") return "🏛️";
  if (type === "whale") return "🐋";
  return "👤";
};

export default function TrustGraph() {
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [animPhase, setAnimPhase] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ w: 840, h: 600 });

  useEffect(() => {
    const interval = setInterval(() => setAnimPhase(p => (p + 1) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  const connectedToSelected = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set(selected.connections);
  }, [selected]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: { from: GraphNode; to: GraphNode; attestation?: Attestation }[] = [];
    NODES.forEach(node => {
      node.connections.forEach(cId => {
        const key = [node.id, cId].sort().join("-");
        if (!seen.has(key)) {
          seen.add(key);
          const target = NODES.find(n => n.id === cId);
          if (target) {
            const att = ATTESTATIONS.find(a =>
              (a.from === node.id && a.to === cId) || (a.from === cId && a.to === node.id)
            );
            result.push({ from: node, to: target, attestation: att });
          }
        }
      });
    });
    return result;
  }, []);

  const networkStats = useMemo(() => ({
    totalNodes: NODES.length,
    avgTrust: Math.round(NODES.reduce((s, n) => s + n.trustScore, 0) / NODES.length),
    totalAttestations: ATTESTATIONS.length,
    sybilFlagged: NODES.filter(n => n.sybilRisk === "high").length,
  }), []);

  const isEdgeHighlighted = (from: string, to: string) => {
    if (!selected && !hovered) return false;
    const focal = selected?.id || hovered;
    return focal === from || focal === to;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold gradient-text">TrustGraph</h1>
        <p className="text-muted-foreground mt-1">Interactive social graph — explore wallet connections, attestations, and Sybil-resistance</p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Network Nodes", value: networkStats.totalNodes, color: "text-[hsl(var(--neon-cyan))]" },
          { icon: ShieldCheck, label: "Avg Trust Score", value: `${networkStats.avgTrust}/100`, color: "text-[hsl(var(--neon-green))]" },
          { icon: Link2, label: "Attestations", value: networkStats.totalAttestations, color: "text-[hsl(var(--neon-purple))]" },
          { icon: ShieldAlert, label: "Sybil Flagged", value: networkStats.sybilFlagged, color: "text-[hsl(var(--destructive))]" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-2 glass-card rounded-xl p-4 relative overflow-hidden" style={{ minHeight: 500 }}>
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {[
              { emoji: "👤", label: "Wallet" },
              { emoji: "🐋", label: "Whale" },
              { emoji: "📜", label: "Contract" },
              { emoji: "🏛️", label: "DAO" },
            ].map(l => (
              <span key={l.label} className="text-xs bg-muted/60 px-2 py-1 rounded-full flex items-center gap-1">
                {l.emoji} {l.label}
              </span>
            ))}
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
            className="w-full h-full"
            style={{ minHeight: 460 }}
          >
            <defs>
              <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--neon-purple))" stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              {NODES.map(n => (
                <radialGradient key={`glow-${n.id}`} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={nodeColor(n)} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={nodeColor(n)} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            <rect width={dimensions.w} height={dimensions.h} fill="url(#bg-glow)" />

            {/* Grid dots */}
            {Array.from({ length: 20 }).map((_, i) =>
              Array.from({ length: 15 }).map((_, j) => (
                <circle
                  key={`dot-${i}-${j}`}
                  cx={i * 44 + 10}
                  cy={j * 44 + 10}
                  r="0.8"
                  fill="hsl(var(--muted-foreground))"
                  opacity="0.15"
                />
              ))
            )}

            {/* Edges */}
            {edges.map((e, i) => {
              const highlighted = isEdgeHighlighted(e.from.id, e.to.id);
              const hasAttestation = !!e.attestation;
              return (
                <g key={`edge-${i}`}>
                  <line
                    x1={e.from.x} y1={e.from.y}
                    x2={e.to.x} y2={e.to.y}
                    stroke={hasAttestation ? "hsl(var(--neon-cyan))" : "hsl(var(--border))"}
                    strokeWidth={highlighted ? 2.5 : 1}
                    opacity={selected && !highlighted ? 0.15 : highlighted ? 0.9 : 0.35}
                    strokeDasharray={hasAttestation ? "none" : "4 4"}
                  />
                  {hasAttestation && highlighted && (
                    <circle r="3" fill="hsl(var(--neon-cyan))">
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={`M${e.from.x},${e.from.y} L${e.to.x},${e.to.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const r = nodeRadius(node);
              const color = nodeColor(node);
              const isFocal = selected?.id === node.id || hovered === node.id;
              const dimmed = selected && selected.id !== node.id && !connectedToSelected.has(node.id);
              const pulseR = r + 8 + Math.sin((animPhase + parseInt(node.id.slice(1)) * 40) * Math.PI / 180) * 4;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-opacity"
                  opacity={dimmed ? 0.2 : 1}
                  onClick={() => setSelected(selected?.id === node.id ? null : node)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Outer glow */}
                  <circle cx={node.x} cy={node.y} r={pulseR} fill={`url(#glow-${node.id})`} opacity={isFocal ? 0.5 : 0.2} />
                  {/* Main circle */}
                  <circle cx={node.x} cy={node.y} r={r} fill="hsl(var(--card))" stroke={color} strokeWidth={isFocal ? 3 : 1.5} />
                  {/* Icon */}
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.7}>
                    {typeIcon(node.type)}
                  </text>
                  {/* Label */}
                  <text
                    x={node.x} y={node.y + r + 14}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="11"
                    fontWeight={isFocal ? "600" : "400"}
                    opacity={dimmed ? 0.3 : 0.9}
                  >
                    {node.label}
                  </text>
                  {/* Trust badge */}
                  <circle cx={node.x + r * 0.7} cy={node.y - r * 0.7} r="9" fill="hsl(var(--card))" stroke={color} strokeWidth="1" />
                  <text
                    x={node.x + r * 0.7} y={node.y - r * 0.7 + 1}
                    textAnchor="middle" dominantBaseline="central"
                    fill={color} fontSize="8" fontWeight="bold"
                  >
                    {node.trustScore}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Inspector Panel */}
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="glass-card rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeIcon(selected.type)}</span>
                    <div>
                      <h3 className="font-bold text-lg">{selected.label}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{selected.address}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Trust Score */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Trust Score</span>
                    <span className="font-bold" style={{ color: nodeColor(selected) }}>{selected.trustScore}/100</span>
                  </div>
                  <Progress value={selected.trustScore} className="h-2" />
                </div>

                {/* Sybil Risk */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Fingerprint className="h-3.5 w-3.5" /> Sybil Risk
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${sybilBadge(selected.sybilRisk).cls}`}>
                    {sybilBadge(selected.sybilRisk).label}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Attestations</p>
                    <p className="text-lg font-bold">{selected.attestations}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Connections</p>
                    <p className="text-lg font-bold">{selected.connections.length}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Activity</p>
                  <p className="text-sm">{selected.activity}</p>
                </div>
              </div>

              {/* Attestations for selected */}
              <div className="glass-card rounded-xl p-5 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[hsl(var(--neon-cyan))]" /> Attestations
                </h4>
                {ATTESTATIONS.filter(a => a.from === selected.id || a.to === selected.id).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No attestations for this node</p>
                ) : (
                  ATTESTATIONS.filter(a => a.from === selected.id || a.to === selected.id).map((att, i) => {
                    const other = att.from === selected.id
                      ? NODES.find(n => n.id === att.to)
                      : NODES.find(n => n.id === att.from);
                    return (
                      <div key={i} className="flex items-center justify-between bg-muted/20 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm font-medium">{att.type}</p>
                          <p className="text-xs text-muted-foreground">↔ {other?.label} · {att.date}</p>
                        </div>
                        <div className="text-xs font-mono text-[hsl(var(--neon-cyan))]">
                          {(att.weight * 100).toFixed(0)}%
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Connected Nodes */}
              <div className="glass-card rounded-xl p-5 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-[hsl(var(--neon-purple))]" /> Connected Nodes
                </h4>
                {selected.connections.map(cId => {
                  const cn = NODES.find(n => n.id === cId)!;
                  return (
                    <button
                      key={cn.id}
                      className="w-full flex items-center justify-between bg-muted/20 rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors text-left"
                      onClick={() => setSelected(cn)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{typeIcon(cn.type)}</span>
                        <div>
                          <p className="text-sm font-medium">{cn.label}</p>
                          <p className="text-xs text-muted-foreground font-mono">{cn.address}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold" style={{ color: nodeColor(cn) }}>{cn.trustScore}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="glass-card rounded-xl p-6 text-center space-y-3">
              <Eye className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <h3 className="font-semibold">Select a Node</h3>
              <p className="text-sm text-muted-foreground">Click any node on the graph to inspect trust scores, attestations, and connections</p>
            </div>
          )}

          {/* Sybil Alerts */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))]" /> Sybil Alerts
            </h4>
            {NODES.filter(n => n.sybilRisk === "high").map(n => (
              <button
                key={n.id}
                className="w-full flex items-center justify-between bg-[hsl(var(--destructive))]/10 rounded-lg px-3 py-2 border border-[hsl(var(--destructive))]/20 hover:bg-[hsl(var(--destructive))]/20 transition-colors text-left"
                onClick={() => setSelected(n)}
              >
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--destructive))]">{n.label}</p>
                  <p className="text-xs text-muted-foreground">Trust: {n.trustScore} · {n.attestations} attestation{n.attestations !== 1 ? "s" : ""}</p>
                </div>
                <ShieldAlert className="h-4 w-4 text-[hsl(var(--destructive))]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
