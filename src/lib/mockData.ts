export const MOCK_WALLET = {
  address: "0x7a25...F3e8",
  fullAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  ensName: "vitalik.eth",
  avatar: "🦊",
};

export const CHAINS = [
  { id: 1, name: "Ethereum", symbol: "ETH", color: "#627EEA", icon: "⟠" },
  { id: 137, name: "Polygon", symbol: "MATIC", color: "#8247E5", icon: "⬡" },
  { id: 56, name: "BNB Chain", symbol: "BNB", color: "#F3BA2F", icon: "◆" },
  { id: 42161, name: "Arbitrum", symbol: "ETH", color: "#28A0F0", icon: "🔵" },
  { id: 10, name: "Optimism", symbol: "ETH", color: "#FF0420", icon: "🔴" },
];

export const TOKENS = [
  { symbol: "ETH", name: "Ethereum", price: 3847.52, change24h: 2.34, balance: 4.2891, icon: "⟠", chain: "Ethereum" },
  { symbol: "BTC", name: "Bitcoin", price: 97234.18, change24h: 1.12, balance: 0.1523, icon: "₿", chain: "Ethereum" },
  { symbol: "USDC", name: "USD Coin", price: 1.00, change24h: 0.01, balance: 12450.00, icon: "💲", chain: "Ethereum" },
  { symbol: "MATIC", name: "Polygon", price: 0.58, change24h: -1.89, balance: 8500, icon: "⬡", chain: "Polygon" },
  { symbol: "LINK", name: "Chainlink", price: 18.45, change24h: 5.67, balance: 150, icon: "⬡", chain: "Ethereum" },
  { symbol: "UNI", name: "Uniswap", price: 12.78, change24h: -0.45, balance: 200, icon: "🦄", chain: "Ethereum" },
  { symbol: "AAVE", name: "Aave", price: 285.30, change24h: 3.21, balance: 15, icon: "👻", chain: "Ethereum" },
  { symbol: "ARB", name: "Arbitrum", price: 1.23, change24h: 4.56, balance: 5000, icon: "🔵", chain: "Arbitrum" },
];

export const PORTFOLIO_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  value: 28000 + Math.sin(i * 0.5) * 3000 + i * 200 + Math.random() * 1000,
}));

export const TRANSACTIONS = [
  { id: "tx1", type: "swap" as const, from: "ETH", to: "USDC", amount: "0.5 ETH", value: "$1,923", time: "2 min ago", status: "confirmed" as const, hash: "0xabc...def" },
  { id: "tx2", type: "receive" as const, from: "0x8b3...a2c", to: "", amount: "1,000 USDC", value: "$1,000", time: "15 min ago", status: "confirmed" as const, hash: "0x123...456" },
  { id: "tx3", type: "send" as const, from: "", to: "0x4e2...b7d", amount: "0.25 ETH", value: "$961", time: "1 hr ago", status: "confirmed" as const, hash: "0x789...abc" },
  { id: "tx4", type: "mint" as const, from: "", to: "", amount: "1 NFT", value: "0.08 ETH", time: "3 hrs ago", status: "confirmed" as const, hash: "0xdef...123" },
  { id: "tx5", type: "swap" as const, from: "USDC", to: "LINK", amount: "500 USDC", value: "$500", time: "5 hrs ago", status: "pending" as const, hash: "0x456...789" },
  { id: "tx6", type: "bridge" as const, from: "Ethereum", to: "Polygon", amount: "2,000 USDC", value: "$2,000", time: "8 hrs ago", status: "confirmed" as const, hash: "0xfed...cba" },
];

export const NFTS = [
  { id: "nft1", name: "Cosmic Voyager #142", collection: "Cosmic Voyagers", price: "2.5 ETH", image: "🌌", rarity: "Legendary", isDynamic: true },
  { id: "nft2", name: "Cyber Punk #87", collection: "CyberPunks", price: "1.2 ETH", image: "🤖", rarity: "Rare", isDynamic: false },
  { id: "nft3", name: "Crystal Dragon #23", collection: "Mythical Beasts", price: "5.0 ETH", image: "🐉", rarity: "Mythic", isDynamic: true },
  { id: "nft4", name: "Neon City #456", collection: "Neon Cities", price: "0.8 ETH", image: "🌃", rarity: "Common", isDynamic: false },
  { id: "nft5", name: "Weather Oracle #1", collection: "Dynamic Oracles", price: "3.0 ETH", image: "🌤️", rarity: "Epic", isDynamic: true },
  { id: "nft6", name: "Sound Wave #78", collection: "Audio NFTs", price: "0.5 ETH", image: "🎵", rarity: "Uncommon", isDynamic: false },
];

export const PROPOSALS = [
  { id: "prop1", title: "Increase Staking Rewards to 12% APY", description: "Proposal to increase the staking rewards pool from 8% to 12% APY to incentivize long-term holding.", status: "active" as const, votesFor: 1240000, votesAgainst: 380000, totalVoters: 2847, endsIn: "2 days", author: "0x7a25...F3e8" },
  { id: "prop2", title: "Deploy on Arbitrum L2", description: "Expand protocol to Arbitrum for lower gas fees and faster transactions.", status: "active" as const, votesFor: 890000, votesAgainst: 120000, totalVoters: 1563, endsIn: "5 days", author: "0x4e2c...b7d1" },
  { id: "prop3", title: "Treasury Diversification", description: "Diversify 20% of treasury into stablecoins for operational stability.", status: "passed" as const, votesFor: 2100000, votesAgainst: 450000, totalVoters: 4231, endsIn: "Ended", author: "0x8b3a...a2c4" },
  { id: "prop4", title: "Grant Program for Developers", description: "Allocate 500K tokens for developer grants over 6 months.", status: "active" as const, votesFor: 560000, votesAgainst: 210000, totalVoters: 987, endsIn: "8 days", author: "0x1f5e...d3a2" },
];

export const YIELD_PROTOCOLS = [
  { name: "Aave V3", token: "ETH", apy: 4.82, tvl: "$8.2B", risk: "Low" as const, chain: "Ethereum", icon: "👻" },
  { name: "Compound", token: "USDC", apy: 5.14, tvl: "$3.1B", risk: "Low" as const, chain: "Ethereum", icon: "🏦" },
  { name: "Yearn Finance", token: "DAI", apy: 7.23, tvl: "$1.8B", risk: "Medium" as const, chain: "Ethereum", icon: "🔵" },
  { name: "Curve", token: "3CRV", apy: 3.95, tvl: "$4.5B", risk: "Low" as const, chain: "Ethereum", icon: "🔄" },
  { name: "Convex", token: "CVX", apy: 12.45, tvl: "$2.3B", risk: "Medium" as const, chain: "Ethereum", icon: "⚡" },
  { name: "GMX", token: "GLP", apy: 18.67, tvl: "$580M", risk: "High" as const, chain: "Arbitrum", icon: "📈" },
  { name: "Lido", token: "stETH", apy: 3.85, tvl: "$14.2B", risk: "Low" as const, chain: "Ethereum", icon: "🌊" },
];

export const WHALE_WALLETS = [
  { address: "0x28C6...9a3F", label: "Smart Money #1", pnl: "+$2.4M", pnlPercent: "+342%", trades: 156, winRate: "78%", topToken: "ETH", lastActive: "5 min ago" },
  { address: "0x9f1A...7bC2", label: "DeFi Whale", pnl: "+$1.8M", pnlPercent: "+215%", trades: 89, winRate: "72%", topToken: "LINK", lastActive: "12 min ago" },
  { address: "0x3eD4...c5E1", label: "NFT Flipper", pnl: "+$890K", pnlPercent: "+156%", trades: 234, winRate: "65%", topToken: "BLUR", lastActive: "1 hr ago" },
  { address: "0x5b2F...d8A3", label: "Yield Farmer", pnl: "+$1.2M", pnlPercent: "+189%", trades: 45, winRate: "82%", topToken: "CRV", lastActive: "30 min ago" },
];

export const CHAT_ROOMS = [
  { id: "room1", name: "General", members: 1247, isGated: false, icon: "💬", lastMessage: "Anyone bullish on ETH today?" },
  { id: "room2", name: "Alpha Calls", members: 89, isGated: true, requiredToken: "ALPHA NFT", icon: "🔒", lastMessage: "New opportunity in..." },
  { id: "room3", name: "NFT Traders", members: 456, isGated: false, icon: "🖼️", lastMessage: "Just minted this sick piece" },
  { id: "room4", name: "DAO Members", members: 234, isGated: true, requiredToken: "GOV Token", icon: "🏛️", lastMessage: "Vote on proposal #4" },
  { id: "room5", name: "DeFi Degens", members: 678, isGated: false, icon: "🔥", lastMessage: "This yield farm looks promising" },
];

export const CHAT_MESSAGES = [
  { id: "msg1", sender: "0x7a25...F3e8", senderName: "vitalik.eth", content: "Hey everyone! What's the sentiment on ETH today?", time: "10:32 AM", isMine: true },
  { id: "msg2", sender: "0x28C6...9a3F", senderName: "whale.eth", content: "Bullish! Just loaded up more at $3,800 🚀", time: "10:33 AM", isMine: false },
  { id: "msg3", sender: "0x9f1A...7bC2", senderName: "defi_king", content: "Check out the new Aave V3 rates, they're insane", time: "10:35 AM", isMine: false },
  { id: "msg4", sender: "0x7a25...F3e8", senderName: "vitalik.eth", content: "Yeah the staking APY looks great. Moved some there.", time: "10:36 AM", isMine: true },
  { id: "msg5", sender: "0x3eD4...c5E1", senderName: "nft_flip", content: "New mint dropping in 30 min, who's in? 👀", time: "10:38 AM", isMine: false },
];

export const STREAMS = [
  { id: "str1", recipient: "0x4e2c...b7d1", recipientName: "alice.eth", token: "USDC", flowRate: "0.0023/sec", totalStreamed: "$1,847.23", startDate: "2024-01-15", status: "active" as const },
  { id: "str2", recipient: "0x8b3a...a2c4", recipientName: "bob.eth", token: "DAI", flowRate: "0.0011/sec", totalStreamed: "$523.45", startDate: "2024-02-01", status: "active" as const },
  { id: "str3", recipient: "0x1f5e...d3a2", recipientName: "carol.eth", token: "ETH", flowRate: "0.000001/sec", totalStreamed: "0.234 ETH", startDate: "2024-01-20", status: "paused" as const },
];

export const NOTIFICATIONS = [
  { id: "n1", type: "transfer" as const, title: "Received 1,000 USDC", description: "From 0x8b3...a2c", time: "2 min ago", read: false },
  { id: "n2", type: "governance" as const, title: "New Proposal: Deploy on Arbitrum", description: "Voting ends in 5 days", time: "15 min ago", read: false },
  { id: "n3", type: "stream" as const, title: "Stream payment received", description: "$23.45 from salary stream", time: "1 hr ago", read: true },
  { id: "n4", type: "nft" as const, title: "NFT Sale Completed", description: "Cosmic Voyager #142 sold for 2.5 ETH", time: "3 hrs ago", read: true },
  { id: "n5", type: "defi" as const, title: "Yield alert: APY increased", description: "Aave ETH pool now at 4.82%", time: "5 hrs ago", read: true },
  { id: "n6", type: "transfer" as const, title: "Transaction confirmed", description: "Swap 0.5 ETH → 1,923 USDC", time: "6 hrs ago", read: true },
];

export const BRIDGE_ROUTES = [
  { provider: "Hop Protocol", fee: "$2.45", time: "2-5 min", liquidity: "High", rating: 4.8 },
  { provider: "Stargate", fee: "$1.80", time: "5-10 min", liquidity: "Very High", rating: 4.7 },
  { provider: "Synapse", fee: "$3.12", time: "1-3 min", liquidity: "Medium", rating: 4.5 },
  { provider: "Across", fee: "$1.50", time: "2-5 min", liquidity: "High", rating: 4.9 },
];

export const FEED_ITEMS = [
  { id: "f1", type: "swap" as const, user: "whale.eth", action: "Swapped 50 ETH → 192,376 USDC", time: "1 min ago", value: "$192,376" },
  { id: "f2", type: "mint" as const, user: "nft_flip", action: "Minted Cosmic Voyager #143", time: "3 min ago", value: "0.08 ETH" },
  { id: "f3", type: "vote" as const, user: "dao_gov", action: "Voted FOR 'Deploy on Arbitrum'", time: "5 min ago", value: "10K votes" },
  { id: "f4", type: "stream" as const, user: "alice.eth", action: "Started streaming 1000 USDC/month to bob.eth", time: "8 min ago", value: "$1,000/mo" },
  { id: "f5", type: "bridge" as const, user: "defi_king", action: "Bridged 5,000 USDC from Ethereum to Polygon", time: "12 min ago", value: "$5,000" },
  { id: "f6", type: "swap" as const, user: "0x5b2F...d8A3", action: "Swapped 10,000 USDC → 540 LINK", time: "18 min ago", value: "$10,000" },
  { id: "f7", type: "mint" as const, user: "creator.eth", action: "Listed Crystal Dragon #24 for 4.8 ETH", time: "25 min ago", value: "4.8 ETH" },
];

export const GAS_PRICES = { slow: 12, standard: 18, fast: 25, instant: 35 };

export const DEX_ROUTES = [
  { dex: "Uniswap V3", price: "3,847.52", share: "45%", gas: "$4.20" },
  { dex: "SushiSwap", price: "3,845.18", share: "30%", gas: "$3.80" },
  { dex: "Curve", price: "3,846.90", share: "25%", gas: "$3.50" },
];
