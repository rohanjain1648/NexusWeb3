import React, { createContext, useContext, useState, useCallback } from "react";
import { MOCK_WALLET, CHAINS } from "@/lib/mockData";

interface WalletState {
  isConnected: boolean;
  address: string;
  ensName: string;
  chainId: number;
  chains: typeof CHAINS;
  connect: () => void;
  disconnect: () => void;
  switchChain: (chainId: number) => void;
}

const WalletContext = createContext<WalletState | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(1);

  const connect = useCallback(() => setIsConnected(true), []);
  const disconnect = useCallback(() => setIsConnected(false), []);
  const switchChain = useCallback((id: number) => setChainId(id), []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address: MOCK_WALLET.address,
        ensName: MOCK_WALLET.ensName,
        chainId,
        chains: CHAINS,
        connect,
        disconnect,
        switchChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
