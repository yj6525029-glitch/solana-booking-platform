'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';

export function WalletButton() {
  const { publicKey, connected, connecting } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      connection.getBalance(publicKey).then(setBalance).catch(console.error);
    }
  }, [connected, publicKey, connection]);

  if (!isReady) {
    return <div className="glass-luxury px-4 py-2 rounded-lg text-cream/60">Loading...</div>;
  }

  if (connecting) {
    return (
      <div className="flex items-center gap-2 glass-luxury px-4 py-2 rounded-lg">
        <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gold">Connecting...</span>
      </div>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-4">
        <div className="glass-luxury py-1 px-3 rounded-lg">
          <span className="text-xs text-cream/60 block">
            {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
          </span>
          <span className="text-xs text-gold font-semibold">
            {balance !== null ? `${(balance / 1e9).toFixed(3)} SOL` : '...'} • Devnet
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <WalletMultiButton className="!bg-gradient-to-r !from-cyan-500 !to-purple-600 !rounded-lg !font-semibold hover:!opacity-90" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-cream/40 bg-midnight px-2 py-1 rounded">Devnet</span>
      <WalletMultiButton className="!bg-gradient-to-r !from-cyan-500 !to-purple-600 !rounded-lg !font-semibold hover:!opacity-90" />
    </div>
  );
}