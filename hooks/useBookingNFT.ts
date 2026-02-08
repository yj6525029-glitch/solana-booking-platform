'use client';

import { useState, useCallback, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  Metaplex,
  walletAdapterIdentity,
  Nft,
} from '@metaplex-foundation/js';

export interface BookingData {
  bookingId: string;
  hotelName: string;
  location: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  price: number;
  customerWallet: string;
  imageUrl?: string;
}

export interface BookingNFT {
  address: string;
  name: string;
  symbol: string;
  uri: string;
  owner: string;
  mintAddress: string;
}

interface MintState {
  nft: BookingNFT | null;
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'uploading' | 'minting' | 'confirmed' | 'failed';
}

/**
 * Hook for minting booking confirmation NFTs
 */
export function useBookingNFT() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [state, setState] = useState<MintState>({
    nft: null,
    isLoading: false,
    error: null,
    status: 'idle',
  });

  // Initialize Metaplex instance when wallet is connected
  const metaplex = useMemo(() => {
    if (!wallet.wallet || !connection || !wallet.publicKey) return null;
    try {
      return Metaplex.make(connection).use(walletAdapterIdentity(wallet.wallet.adapter));
    } catch {
      return null;
    }
  }, [wallet.wallet, wallet.publicKey, connection]);

  /**
   * Generate NFT metadata JSON
   */
  const generateMetadata = useCallback((booking: BookingData) => {
    const image = booking.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
    
    return {
      name: `Booking: ${booking.hotelName}`.slice(0, 40),
      symbol: 'BOOK',
      description: `Room reservation at ${booking.hotelName} in ${booking.location}. ${booking.nights} night${booking.nights > 1 ? 's' : ''} stay.`,
      image,
      attributes: [
        { trait_type: 'Hotel', value: booking.hotelName },
        { trait_type: 'Location', value: booking.location },
        { trait_type: 'Room Type', value: booking.roomType },
        { trait_type: 'Check-in', value: booking.checkIn },
        { trait_type: 'Check-out', value: booking.checkOut },
        { trait_type: 'Nights', value: booking.nights.toString() },
        { trait_type: 'Price', value: `${booking.price} USDC` },
        { trait_type: 'Booking ID', value: booking.bookingId },
        { trait_type: 'Network', value: 'devnet' },
        { trait_type: 'Platform', value: 'Solana Booking Agent' },
      ],
      properties: {
        category: 'booking',
        creators: [
          {
            address: booking.customerWallet,
            share: 100,
          },
        ],
        files: [
          {
            uri: image,
            type: 'image/jpeg',
          },
        ],
      },
    };
  }, []);

  /**
   * Mint NFT as booking confirmation
   */
  const mintBookingNFT = useCallback(
    async (bookingData: BookingData): Promise<BookingNFT | null> => {
      if (!metaplex || !wallet.publicKey) {
        setState({
          nft: null,
          isLoading: false,
          error: 'Wallet not connected',
          status: 'failed',
        });
        return null;
      }

      setState({
        nft: null,
        isLoading: true,
        error: null,
        status: 'minting',
      });

      try {
        // Generate metadata
        const metadata = generateMetadata(bookingData);
        
        // Upload to Arweave via Metaplex/Bundlr
        const { uri } = await metaplex.nfts().uploadMetadata({
          ...metadata,
        });

        if (!uri) {
          throw new Error('Failed to upload metadata');
        }

        // Create NFT with simplified creators array
        const { nft } = await metaplex.nfts().create({
          uri,
          name: metadata.name,
          symbol: metadata.symbol,
          sellerFeeBasisPoints: 0,
          creators: [
            {
              address: wallet.publicKey,
              share: 100,
            },
          ],
        });

        const bookingNFT: BookingNFT = {
          address: nft.address.toString(),
          name: nft.name,
          symbol: nft.symbol || 'BOOK',
          uri: nft.uri,
          owner: wallet.publicKey.toString(),
          mintAddress: nft.mint.address.toString(),
        };

        setState({
          nft: bookingNFT,
          isLoading: false,
          error: null,
          status: 'confirmed',
        });

        return bookingNFT;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to mint NFT';
        setState({
          nft: null,
          isLoading: false,
          error: message,
          status: 'failed',
        });
        return null;
      }
    },
    [metaplex, wallet.publicKey]
  );

  const reset = useCallback(() => {
    setState({
      nft: null,
      isLoading: false,
      error: null,
      status: 'idle',
    });
  }, []);

  return {
    ...state,
    mintBookingNFT,
    reset,
  };
}
