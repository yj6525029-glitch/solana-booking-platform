'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

// dApp metadata for WalletConnect
const WC_METADATA = {
  name: 'WanderLux',
  description: 'Open protocol for luxury vacation rentals on Solana',
  url: 'https://solana-booking-platform.vercel.app',
  icons: ['https://solana-booking-platform.vercel.app/logo.png'],
};

export function Providers({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      // Desktop + Mobile browser extension wallets
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      // Universal Mobile support via WalletConnect
      new WalletConnectWalletAdapter({
        network,
        options: {
          projectId: 'a5a776b4b32d8e57e69ae553df9840a9', // Public WalletConnect project ID
          metadata: WC_METADATA,
        },
      }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
