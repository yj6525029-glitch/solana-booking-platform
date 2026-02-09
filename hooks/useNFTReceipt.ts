'use client';

import { useState, useCallback, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Property } from '@/data/listings';

export interface BookingReceipt {
  bookingId: string;
  property: Property;
  amount: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  customerWallet: string;
  timestamp: number;
}

export interface MintedNFTReceipt {
  address: string;
  name: string;
  symbol: string;
  uri: string;
  mintAddress: string;
  transactionSignature: string;
  explorerUrl: string;
}

interface NFTReceiptState {
  nft: MintedNFTReceipt | null;
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'uploading' | 'minting' | 'confirmed' | 'failed';
}

/**
 * Hook for minting NFT booking receipts
 * Uses Metaplex to mint NFTs with booking metadata as proof of reservation
 */
export function useNFTReceipt() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [state, setState] = useState<NFTReceiptState>({
    nft: null,
    isLoading: false,
    error: null,
    status: 'idle',
  });

  // Initialize Metaplex instance when wallet is connected
  const metaplex = useMemo(() => {
    if (!wallet.wallet || !connection || !wallet.publicKey) return null;
    try {
      return Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet.wallet.adapter));
    } catch {
      return null;
    }
  }, [wallet.wallet, wallet.publicKey, connection]);

  /**
   * Generate NFT metadata JSON for the booking receipt
   */
  const generateReceiptMetadata = useCallback((receipt: BookingReceipt) => {
    const image = receipt.property.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
    const bookingDate = new Date(receipt.timestamp).toISOString().split('T')[0];
    
    return {
      name: `WanderLux Booking: ${receipt.property.title.slice(0, 25)}`,
      symbol: 'WLUX',
      description: `Official booking receipt for ${receipt.property.title} in ${receipt.property.location.city}, ${receipt.property.location.country}. ${receipt.nights} night${receipt.nights > 1 ? 's' : ''} stay at ${receipt.amount.toFixed(2)} SOL.`,
      image,
      attributes: [
        { trait_type: 'Property', value: receipt.property.title },
        { trait_type: 'Location', value: `${receipt.property.location.city}, ${receipt.property.location.country}` },
        { trait_type: 'Property Type', value: receipt.property.propertyType },
        { trait_type: 'Check-in', value: receipt.checkIn },
        { trait_type: 'Check-out', value: receipt.checkOut },
        { trait_type: 'Nights', value: receipt.nights.toString() },
        { trait_type: 'Total Amount', value: `${receipt.amount.toFixed(2)} SOL` },
        { trait_type: 'Booking ID', value: receipt.bookingId },
        { trait_type: 'Booking Date', value: bookingDate },
        { trait_type: 'Max Guests', value: receipt.property.maxGuests.toString() },
        { trait_type: 'Bedrooms', value: receipt.property.bedrooms.toString() },
        { trait_type: 'Network', value: 'devnet' },
        { trait_type: 'Platform', value: 'WanderLux' },
        { trait_type: 'Verified', value: receipt.property.verified ? 'Yes' : 'No' },
      ],
      properties: {
        category: 'receipt',
        receipts: [
          {
            uri: image,
            type: 'image/jpeg',
          },
        ],
        creators: [
          {
            address: receipt.customerWallet,
            share: 100,
          },
        ],
      },
    };
  }, []);

  /**
   * Mint NFT receipt for a booking
   * Uploads metadata to Arweave via Metaplex Bundlr, then mints NFT
   */
  const mintReceipt = useCallback(
    async (
      bookingId: string,
      property: Property,
      amount: number,
      nights: number = 2,
      checkIn?: string,
      checkOut?: string
    ): Promise<MintedNFTReceipt | null> => {
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
        status: 'uploading',
      });

      try {
        // Calculate default dates if not provided
        const today = new Date();
        const defaultCheckIn = new Date(today);
        defaultCheckIn.setDate(today.getDate() + 7);
        const defaultCheckOut = new Date(defaultCheckIn);
        defaultCheckOut.setDate(defaultCheckIn.getDate() + nights);

        const receipt: BookingReceipt = {
          bookingId,
          property,
          amount,
          nights,
          checkIn: checkIn || defaultCheckIn.toISOString().split('T')[0],
          checkOut: checkOut || defaultCheckOut.toISOString().split('T')[0],
          customerWallet: wallet.publicKey.toString(),
          timestamp: Date.now(),
        };

        // Generate metadata
        const metadata = generateReceiptMetadata(receipt);

        // Upload metadata to Arweave via Metaplex
        setState((prev) => ({ ...prev, status: 'uploading' }));
        const { uploadMetadata } = metaplex.nfts();
        const { uri } = await uploadMetadata(metadata);

        if (!uri) {
          throw new Error('Failed to upload metadata to storage');
        }

        // Mint the NFT
        setState((prev) => ({ ...prev, status: 'minting' }));
        const { nft, response } = await metaplex.nfts().create({
          uri,
          name: metadata.name,
          symbol: metadata.symbol,
          sellerFeeBasisPoints: 0, // No royalties for receipts
          creators: [
            {
              address: wallet.publicKey,
              share: 100,
              
            },
          ],
          isMutable: false, // Make receipt immutable (can't be changed)
        });

        const transactionSignature = response.signature;
        const mintAddress = nft.mint.address.toString();
        const address = nft.address.toString();

        // Generate Solana explorer URL (devnet)
        const explorerUrl = `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`;

        const mintedNFT: MintedNFTReceipt = {
          address,
          name: nft.name,
          symbol: nft.symbol || 'WLUX',
          uri: nft.uri,
          mintAddress,
          transactionSignature,
          explorerUrl,
        };

        setState({
          nft: mintedNFT,
          isLoading: false,
          error: null,
          status: 'confirmed',
        });

        return mintedNFT;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to mint NFT receipt';
        console.error('NFT minting error:', error);
        setState({
          nft: null,
          isLoading: false,
          error: message,
          status: 'failed',
        });
        return null;
      }
    },
    [metaplex, wallet.publicKey, generateReceiptMetadata]
  );

  /**
   * Reset the hook state
   */
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
    mintReceipt,
    reset,
  };
}
