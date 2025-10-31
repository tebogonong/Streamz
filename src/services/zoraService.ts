// Zora Coins SDK Service for Token Creation
// Documentation: https://docs.zora.co/coins/sdk/create-coin

import { createCoinCall, CreateConstants, type CreateCoinArgs } from '@zoralabs/coins-sdk';
import type { Address } from 'viem';

export interface ZoraTokenMetadata {
  type: 'RAW_URI';
  uri: string;
}

export interface ZoraTokenCreationParams {
  creator: string; // Wallet address of the creator
  name: string; // Token name
  symbol: string; // Token symbol (e.g., "BALI")
  metadata: ZoraTokenMetadata;
  currency: 'ETH' | 'CREATOR_COIN' | 'ZORA' | 'CREATOR_COIN_OR_ZORA';
  chainId: number; // e.g., 84532 for Base Sepolia, 8453 for Base
  startingMarketCap: 'LOW' | 'HIGH';
  platformReferrer?: string;
  additionalOwners?: Address[];
  payoutRecipientOverride?: Address;
}

export interface ZoraTransactionCall {
  to: Address;
  data: `0x${string}`;
  value: bigint;
}

export interface ZoraTokenCreationResponse {
  calls: ZoraTransactionCall[];
}

/**
 * Create a new token using Zora Coins SDK
 * @param params Token creation parameters
 * @returns Transaction calls to execute on-chain
 */
export async function createZoraToken(
  params: ZoraTokenCreationParams
): Promise<ZoraTokenCreationResponse> {
  console.log('🪙 Creating Zora Coin with SDK...', {
    creator: params.creator,
    name: params.name,
    symbol: params.symbol,
    chainId: params.chainId,
    metadataUri: params.metadata.uri,
    currency: params.currency,
    startingMarketCap: params.startingMarketCap,
  });

  try {
    // Map our params to Zora SDK format
    const coinArgs: CreateCoinArgs = {
      creator: params.creator as Address,
      name: params.name,
      symbol: params.symbol,
      metadata: {
        type: 'RAW_URI' as const,
        uri: params.metadata.uri,
      },
      currency: mapCurrency(params.currency, params.chainId),
      chainId: params.chainId,
      startingMarketCap: params.startingMarketCap === 'HIGH' 
        ? CreateConstants.StartingMarketCaps.HIGH 
        : CreateConstants.StartingMarketCaps.LOW,
      ...(params.platformReferrer && { platformReferrerAddress: params.platformReferrer as Address }),
      ...(params.additionalOwners && params.additionalOwners.length > 0 && { additionalOwners: params.additionalOwners }),
      ...(params.payoutRecipientOverride && { payoutRecipientOverride: params.payoutRecipientOverride }),
    };

    console.log('� SDK Args:', coinArgs);

    // Use the SDK to generate transaction calls
    const txCalls = await createCoinCall(coinArgs);
    
    console.log('✅ Transaction calls generated:', {
      callsCount: txCalls.length,
      firstCall: {
        to: txCalls[0]?.to,
        valueInWei: txCalls[0]?.value?.toString(),
        dataLength: txCalls[0]?.data?.length,
      },
    });

    return {
      calls: txCalls.map(call => ({
        to: call.to,
        data: call.data,
        value: call.value,
      })),
    };
  } catch (error) {
    console.error('❌ Error creating Zora coin:', error);
    throw error;
  }
}

/**
 * Map currency string to Zora SDK currency enum
 * Note: ZORA, CREATOR_COIN, and CREATOR_COIN_OR_ZORA are not available on Base Sepolia
 */
function mapCurrency(currency: string, chainId: number): any {
  const isBaseSepolia = chainId === 84532;
  
  // Base Sepolia only supports ETH
  if (isBaseSepolia) {
    console.log('⚠️ Base Sepolia detected - using ETH currency');
    return CreateConstants.ContentCoinCurrencies.ETH;
  }

  switch (currency) {
    case 'CREATOR_COIN':
      return CreateConstants.ContentCoinCurrencies.CREATOR_COIN;
    case 'ZORA':
      return CreateConstants.ContentCoinCurrencies.ZORA;
    case 'CREATOR_COIN_OR_ZORA':
      return CreateConstants.ContentCoinCurrencies.CREATOR_COIN_OR_ZORA;
    case 'ETH':
    default:
      return CreateConstants.ContentCoinCurrencies.ETH;
  }
}

/**
 * Helper function to validate token creation parameters
 */
export function validateTokenParams(params: Partial<ZoraTokenCreationParams>): string[] {
  const errors: string[] = [];

  if (!params.creator || !params.creator.match(/^0x[a-fA-F0-9]{40}$/)) {
    errors.push('Invalid creator address');
  }

  if (!params.name || params.name.trim().length === 0) {
    errors.push('Token name is required');
  }

  if (!params.symbol || params.symbol.trim().length === 0) {
    errors.push('Token symbol is required');
  }

  if (params.symbol && (params.symbol.length < 2 || params.symbol.length > 10)) {
    errors.push('Token symbol must be between 2 and 10 characters');
  }

  if (!params.metadata?.uri || !isValidUrl(params.metadata.uri)) {
    errors.push('Valid metadata URI is required');
  }

  if (!params.chainId || params.chainId <= 0) {
    errors.push('Valid chain ID is required');
  }

  return errors;
}

/**
 * Helper function to validate URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get supported chain IDs for Zora Coins creation
 * Source: https://docs.zora.co/coins/sdk/create-coin
 */
export const SUPPORTED_CHAINS = {
  BASE_SEPOLIA: 84532, // Testnet - ETH only
  BASE: 8453, // Mainnet - All currencies supported
  ZORA: 7777777, // Zora Network - All currencies supported
} as const;

/**
 * Get available currencies for a chain
 */
export function getAvailableCurrencies(chainId: number): string[] {
  if (chainId === 84532) {
    // Base Sepolia only supports ETH
    return ['ETH'];
  }
  // Base and Zora support all currencies
  return ['ETH', 'CREATOR_COIN', 'ZORA', 'CREATOR_COIN_OR_ZORA'];
}

/**
 * Get chain name from chain ID
 */
export function getChainName(chainId: number): string {
  const chainMap: Record<number, string> = {
    84532: 'Base Sepolia',
    8453: 'Base',
    1: 'Ethereum',
    10: 'Optimism',
    7777777: 'Zora',
  };
  return chainMap[chainId] || 'Unknown Chain';
}
