import {
  LayoutDashboard, ArrowLeftRight, Globe, Image, MessageCircle,
  Vote, TrendingUp, Users, Waves, Bot, Rss, Bell, Settings, Landmark, Gem, Zap, Brain, Radio, Shield
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Swap", url: "/swap", icon: ArrowLeftRight },
  { title: "Bridge", url: "/bridge", icon: Globe },
  { title: "NFTs", url: "/nfts", icon: Image },
  { title: "Streams", url: "/streams", icon: Waves },
];

const communityItems = [
  { title: "Chat", url: "/chat", icon: MessageCircle },
  { title: "Governance", url: "/governance", icon: Vote },
  { title: "Feed", url: "/feed", icon: Rss },
  { title: "Social Trading", url: "/social", icon: Users },
];

const defiItems = [
  { title: "Yield", url: "/yield", icon: TrendingUp },
  { title: "Fractional NFTs", url: "/nfts/fractional", icon: Gem },
  { title: "Mint NFT", url: "/nfts/mint", icon: Landmark },
];

const toolItems = [
  { title: "WishExec", url: "/wishexec", icon: Zap },
  { title: "Chain Shrink", url: "/chain-shrink", icon: Brain },
  { title: "Mempool Stories", url: "/mempool", icon: Radio },
  { title: "TrustGraph", url: "/trust-graph", icon: Shield },
  { title: "AI Assistant", url: "/ai-assistant", icon: Bot },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup key={label}>
      {!collapsed && <SidebarGroupLabel className="text-muted-foreground/60 text-xs uppercase tracking-wider">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink
                  to={item.url}
                  end
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted/50"
                  activeClassName="bg-primary/10 text-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <div className="p-4 border-b border-border/50">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            W3
          </div>
          {!collapsed && <span className="font-bold text-lg gradient-text">NexusWeb3</span>}
        </NavLink>
      </div>
      <SidebarContent className="scrollbar-thin">
        {renderGroup("Main", mainItems)}
        {renderGroup("Community", communityItems)}
        {renderGroup("DeFi", defiItems)}
        {renderGroup("Tools", toolItems)}
      </SidebarContent>
    </Sidebar>
  );
}
