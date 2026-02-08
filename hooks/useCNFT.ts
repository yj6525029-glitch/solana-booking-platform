'use client';

import { useState, useCallback } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  createNoopSigner,
  signerIdentity,
  generateSigner,
  percentAmount,
} from '@metaplex-foundation/umi';
import { 
  mintV1,
  createTree,
  findLeafAssetIdPda,
} from '@metaplex-foundation/mpl-bubblegum';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';

interface CNFTState {
  isMinting: boolean;
  nftAddress: string | null;
  error: string | null;
}

interface BookingMetadata {
  hotelName: string;
  location: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  price: number;
  bookingId: string;
  guestWallet: string;
}

// Devnet RPC endpoint
const DEVNET_RPC = 'https://api.devnet.solana.com';

// Tree address for cNFTs (would be created and funded separately)
// For hackathon, using a pre-created tree
const MERKLE_TREE = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export function useCNFT() {
  const [state, setState] = useState<CNFTState>({
    isMinting: false,
    nftAddress: null,
    error: null,
  });

  const mintBookingConfirmation = useCallback(async (
    metadata: BookingMetadata,
    wallet: PublicKey
  ) => {
    setState({ isMinting: true, nftAddress: null, error: null });

    try {
      // Initialize Umi
      const umi = createUmi(DEVNET_RPC);
      
      // Create a signer from the wallet
      const mySigner = createNoopSigner(wallet);
      umi.use(signerIdentity(mySigner));

      // Create metadata JSON
      const metadataJson = {
        name: `Booking: ${metadata.hotelName}`,
        symbol: 'BOOK',
        description: `Room reservation at ${metadata.hotelName} in ${metadata.location}`,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        attributes: [
          { trait_type: 'Hotel', value: metadata.hotelName },
          { trait_type: 'Location', value: metadata.location },
          { trait_type: 'Room Type', value: metadata.roomType },
          { trait_type: 'Check-in', value: metadata.checkIn },
          { trait_type: 'Check-out', value: metadata.checkOut },
          { trait_type: 'Nights', value: metadata.nights.toString() },
          { trait_type: 'Price', value: `${metadata.price} USDC` },
          { trait_type: 'Booking ID', value: metadata.bookingId },
        ],
        properties: {
          category: 'booking',
          creators: [{ address: wallet.toString(), share: 100 }],
        },
      };

      // For demo/hackathon purposes, mint a regular NFT instead of cNFT
      // (cNFT requires funded tree which is complex for hackathon demo)
      const mint = generateSigner(umi);
      
      await createNft(umi, {
        mint,
        name: metadataJson.name,
        symbol: metadataJson.symbol,
        uri: 'data:application/json;base64,' + btoa(JSON.stringify(metadataJson)),
        sellerFeeBasisPoints: percentAmount(0),
        creators: [{ address: umi.identity.publicKey, share: 100 }],
      }).sendAndConfirm(umi);

      const mintAddress = mint.publicKey.toString();
      
      setState({
        isMinting: false,
        nftAddress: mintAddress,
        error: null,
      });

      return { success: true, mintAddress };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to mint NFT';
      setState({ isMinting: false, nftAddress: null, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  const clearState = useCallback(() => {
    setState({ isMinting: false, nftAddress: null, error: null });
  }, []);

  return {
    ...state,
    mintBookingConfirmation,
    clearState,
  };
}
