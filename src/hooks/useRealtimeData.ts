import { useState, useEffect, useCallback, useRef } from "react";
import { TOKENS, GAS_PRICES, PORTFOLIO_HISTORY, TRANSACTIONS } from "@/lib/mockData";

interface LiveToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  balance: number;
  icon: string;
  chain: string;
}

interface LiveTransaction {
  id: string;
  type: "swap" | "receive" | "send" | "mint" | "bridge";
  from: string;
  to: string;
  amount: string;
  value: string;
  time: string;
  status: "confirmed" | "pending";
  hash: string;
}

const TX_TEMPLATES: Omit<LiveTransaction, "id" | "time">[] = [
  { type: "swap", from: "ETH", to: "USDC", amount: "0.12 ETH", value: "$461", status: "confirmed", hash: "0xf1a...3b2" },
  { type: "receive", from: "0x3eD4...c5E1", to: "", amount: "250 USDC", value: "$250", status: "confirmed", hash: "0xa2c...7d1" },
  { type: "send", from: "", to: "0x9f1A...7bC2", amount: "0.05 ETH", value: "$192", status: "pending", hash: "0xb3d...8e4" },
  { type: "mint", from: "", to: "", amount: "1 NFT", value: "0.02 ETH", status: "confirmed", hash: "0xc4e...9f5" },
  { type: "swap", from: "LINK", to: "ETH", amount: "25 LINK", value: "$461", status: "confirmed", hash: "0xd5f...a06" },
  { type: "bridge", from: "Polygon", to: "Ethereum", amount: "500 MATIC", value: "$290", status: "pending", hash: "0xe6a...b17" },
  { type: "receive", from: "0x5b2F...d8A3", to: "", amount: "0.8 ETH", value: "$3,078", status: "confirmed", hash: "0xf7b...c28" },
];

export function useRealtimeData() {
  const [tokens, setTokens] = useState<LiveToken[]>(() => TOKENS.map(t => ({ ...t })));
  const [gasPrice, setGasPrice] = useState(GAS_PRICES.standard);
  const [portfolioHistory, setPortfolioHistory] = useState(() => [...PORTFOLIO_HISTORY]);
  const [transactions, setTransactions] = useState<LiveTransaction[]>(() => TRANSACTIONS.map(t => ({ ...t })));
  const [totalStreamed, setTotalStreamed] = useState(2370);
  const [pnl, setPnl] = useState(1847.23);
  const tickRef = useRef(0);

  // Simulate price ticks every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++;

      setTokens(prev => prev.map(t => {
        const drift = (Math.random() - 0.48) * t.price * 0.003;
        const newPrice = Math.max(t.price * 0.95, t.price + drift);
        const changeDrift = (Math.random() - 0.5) * 0.15;
        return { ...t, price: newPrice, change24h: +(t.change24h + changeDrift).toFixed(2) };
      }));

      setGasPrice(prev => {
        const d = Math.floor((Math.random() - 0.5) * 3);
        return Math.max(8, Math.min(50, prev + d));
      });

      setPnl(prev => +(prev + (Math.random() - 0.45) * 25).toFixed(2));
      setTotalStreamed(prev => +(prev + 0.08).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Append chart point every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioHistory(prev => {
        const last = prev[prev.length - 1];
        const newVal = last.value + (Math.random() - 0.45) * 500;
        const now = new Date();
        const newPoint = {
          date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: newVal,
        };
        return [...prev.slice(-29), newPoint];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Add random transaction every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      const template = TX_TEMPLATES[Math.floor(Math.random() * TX_TEMPLATES.length)];
      const newTx: LiveTransaction = {
        ...template,
        id: `tx-live-${Date.now()}`,
        time: "just now",
      };
      setTransactions(prev => [newTx, ...prev.slice(0, 5)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const portfolioValue = tokens.reduce((sum, t) => sum + t.price * t.balance, 0);

  return { tokens, gasPrice, portfolioHistory, transactions, totalStreamed, pnl, portfolioValue };
}
