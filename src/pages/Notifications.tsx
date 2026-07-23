import { useState } from "react";
import { NOTIFICATIONS } from "@/lib/mockData";
import { Bell, ArrowDownLeft, Vote, Waves, Image, TrendingUp, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const typeIcons: Record<string, { icon: any; color: string }> = {
  transfer: { icon: ArrowDownLeft, color: "text-neon-green bg-neon-green/10" },
  governance: { icon: Vote, color: "text-neon-orange bg-neon-orange/10" },
  stream: { icon: Waves, color: "text-secondary bg-secondary/10" },
  nft: { icon: Image, color: "text-neon-cyan bg-neon-cyan/10" },
  defi: { icon: TrendingUp, color: "text-primary bg-primary/10" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Web3-native push alerts</p>
        </div>
        <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
          <Check className="h-3 w-3" /> Mark all read
        </button>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-3">Push Preferences</h2>
        <div className="space-y-3">
          {[
            { label: "Transfers & Transactions", enabled: true },
            { label: "Governance & Voting", enabled: true },
            { label: "Stream Payments", enabled: true },
            { label: "NFT Sales & Mints", enabled: false },
            { label: "DeFi Yield Alerts", enabled: true },
          ].map((p) => (
            <div key={p.label} className="flex items-center justify-between py-1">
              <span className="text-sm">{p.label}</span>
              <Switch defaultChecked={p.enabled} />
            </div>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {notifications.map((n) => {
          const typeInfo = typeIcons[n.type] || typeIcons.transfer;
          const Icon = typeInfo.icon;
          return (
            <div key={n.id} className={`glass-card p-4 flex items-center gap-4 transition-colors ${!n.read ? "border-l-2 border-l-primary" : ""}`}>
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? "font-semibold" : ""}`}>{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.description}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
