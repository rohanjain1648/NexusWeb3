import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Sparkles, ArrowRight } from "lucide-react";

const suggestedPrompts = [
  "Swap 5 ETH to stablecoins",
  "Create a new governance proposal",
  "Check gas prices across chains",
  "Show my portfolio summary",
  "Bridge 1000 USDC to Polygon",
  "Stake ETH in Lido",
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  txPreview?: { action: string; details: string; estimatedGas: string };
}

const initialMessages: Message[] = [
  { id: "1", role: "ai", content: "Hello! I'm your AI Smart Contract Assistant. I can help you interact with smart contracts using natural language. Try asking me to swap tokens, create proposals, or check your portfolio! 🤖" },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    const userMsg: Message = { id: `u${Date.now()}`, role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `a${Date.now()}`,
        role: "ai",
        content: msg.toLowerCase().includes("swap")
          ? "I found the best route for your swap. Here's the transaction preview:"
          : msg.toLowerCase().includes("proposal")
          ? "I'll help you create a governance proposal. Here's what I've prepared:"
          : msg.toLowerCase().includes("gas")
          ? "Here are the current gas prices:\n\n• Ethereum: 18 Gwei (Standard)\n• Polygon: 30 Gwei\n• Arbitrum: 0.1 Gwei\n• Optimism: 0.001 Gwei\n\nArbitrum and Optimism offer the lowest fees right now! 🚀"
          : "I understand your request. Let me process that for you. Based on your wallet activity and current market conditions, here's what I recommend...",
        txPreview: msg.toLowerCase().includes("swap")
          ? { action: "Swap 5 ETH → ~19,237 USDC", details: "Via Uniswap V3 (45%) + SushiSwap (55%)", estimatedGas: "$4.50" }
          : msg.toLowerCase().includes("proposal")
          ? { action: "Create Proposal: 'New Feature Request'", details: "Quadratic voting enabled • 7 day voting period", estimatedGas: "$8.20" }
          : undefined,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bot className="h-6 w-6 text-primary" /> AI Assistant</h1>
        <p className="text-sm text-muted-foreground">Natural language smart contract interaction</p>
      </div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${msg.role === "user" ? "bg-primary/20 border-primary/20" : "bg-muted/40 border-border/50"} border rounded-2xl px-4 py-3`}>
                {msg.role === "ai" && <span className="text-xs text-primary font-medium flex items-center gap-1 mb-1"><Bot className="h-3 w-3" /> NexusAI</span>}
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                {msg.txPreview && (
                  <div className="mt-3 p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                    <p className="text-xs font-semibold text-primary">Transaction Preview</p>
                    <p className="text-sm font-medium">{msg.txPreview.action}</p>
                    <p className="text-xs text-muted-foreground">{msg.txPreview.details}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Est. Gas: {msg.txPreview.estimatedGas}</span>
                      <Button size="sm" className="gradient-primary text-xs h-7">Confirm & Execute</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-muted/40 border border-border/50 rounded-2xl px-4 py-3">
                <span className="text-sm text-muted-foreground animate-pulse-slow">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 border-t border-border/30">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {suggestedPrompts.map((p) => (
              <button key={p} onClick={() => handleSend(p)} className="shrink-0 px-3 py-1.5 rounded-lg bg-muted/40 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Sparkles className="h-3 w-3 inline mr-1" />{p}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask me anything about Web3..." className="flex-1 bg-muted/40 rounded-xl px-4 py-2.5 text-sm outline-none border border-border/50 focus:border-primary/30" />
            <Button size="icon" className="gradient-primary rounded-xl" onClick={() => handleSend()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
