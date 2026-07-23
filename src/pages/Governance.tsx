import { useState } from "react";
import { PROPOSALS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Vote, Clock, Users, CheckCircle, XCircle, Award } from "lucide-react";

const badges = [
  { name: "Developer", icon: "💻", level: 3 },
  { name: "Voter", icon: "🗳️", level: 5 },
  { name: "Contributor", icon: "⭐", level: 2 },
  { name: "Moderator", icon: "🛡️", level: 1 },
];

export default function Governance() {
  const [voted, setVoted] = useState<Record<string, "for" | "against">>({});

  const handleVote = (id: string, vote: "for" | "against") => {
    setVoted((prev) => ({ ...prev, [id]: vote }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">DAO Governance</h1>
        <p className="text-sm text-muted-foreground">Vote on proposals & earn reputation</p>
      </div>

      {/* Reputation Badges */}
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-neon-orange" /> Your Reputation</h2>
        <div className="flex flex-wrap gap-3">
          {badges.map((b) => (
            <div key={b.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50">
              <span className="text-xl">{b.icon}</span>
              <div>
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-muted-foreground">Level {b.level}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {PROPOSALS.map((prop) => {
          const total = prop.votesFor + prop.votesAgainst;
          const forPercent = total > 0 ? (prop.votesFor / total) * 100 : 0;
          const myVote = voted[prop.id];

          return (
            <div key={prop.id} className="glass-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{prop.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                  prop.status === "active" ? "bg-neon-green/10 text-neon-green" :
                  prop.status === "passed" ? "bg-primary/10 text-primary" :
                  "bg-destructive/10 text-destructive"
                }`}>
                  {prop.status}
                </span>
              </div>

              {/* Vote Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neon-green">For {forPercent.toFixed(0)}%</span>
                  <span className="text-destructive">Against {(100 - forPercent).toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-destructive/20 overflow-hidden">
                  <div className="h-full bg-neon-green rounded-full transition-all" style={{ width: `${forPercent}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{prop.totalVoters.toLocaleString()} voters</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{prop.endsIn}</span>
                </div>
                {prop.status === "active" && !myVote && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10" onClick={() => handleVote(prop.id, "for")}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Vote For
                    </Button>
                    <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleVote(prop.id, "against")}>
                      <XCircle className="h-3 w-3 mr-1" /> Against
                    </Button>
                  </div>
                )}
                {myVote && (
                  <span className={`text-xs px-2 py-1 rounded ${myVote === "for" ? "bg-neon-green/10 text-neon-green" : "bg-destructive/10 text-destructive"}`}>
                    Voted {myVote === "for" ? "✓ For" : "✗ Against"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
