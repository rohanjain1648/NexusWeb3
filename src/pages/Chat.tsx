import { useState } from "react";
import { CHAT_ROOMS, CHAT_MESSAGES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Send, Lock, Hash, Users } from "lucide-react";

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState("room1");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: `msg${Date.now()}`, sender: "0x7a25...F3e8", senderName: "vitalik.eth",
      content: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isMine: true,
    }]);
    setMessage("");
  };

  const currentRoom = CHAT_ROOMS.find((r) => r.id === activeRoom)!;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 animate-fade-in">
      {/* Room List */}
      <div className="w-64 shrink-0 glass-card p-4 space-y-2 hidden md:block overflow-auto">
        <h2 className="font-semibold text-sm mb-3">Channels</h2>
        {CHAT_ROOMS.map((room) => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${activeRoom === room.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/40"}`}
          >
            <div className="flex items-center gap-2">
              <span>{room.icon}</span>
              <span className="text-sm font-medium">{room.name}</span>
              {room.isGated && <Lock className="h-3 w-3 text-neon-orange" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">{room.lastMessage}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/60">
              <Users className="h-3 w-3" /> {room.members}
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center gap-2">
          <span>{currentRoom.icon}</span>
          <span className="font-semibold">{currentRoom.name}</span>
          {currentRoom.isGated && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-neon-orange/10 text-neon-orange flex items-center gap-1">
              <Lock className="h-3 w-3" /> Token Gated
            </span>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{currentRoom.members} members</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${msg.isMine ? "bg-primary/20 border-primary/20" : "bg-muted/40 border-border/50"} border rounded-2xl px-4 py-2.5`}>
                {!msg.isMine && <p className="text-xs text-primary font-medium mb-0.5">{msg.senderName}</p>}
                <p className="text-sm">{msg.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-muted/40 rounded-xl px-4 py-2.5 text-sm outline-none border border-border/50 focus:border-primary/30"
            />
            <Button size="icon" className="gradient-primary rounded-xl" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
