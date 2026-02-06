'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-4">
      {connected && publicKey ? (
        <span className="text-sm text-cyan-400">
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </span>
      ) : null}
      <WalletMultiButton className="!bg-gradient-to-r !from-cyan-500 !to-purple-600 !rounded-lg !font-semibold hover:!opacity-90" />
    </div>
  );
}
