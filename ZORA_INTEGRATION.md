# 🎨 Zora Token Creation Integration

## Overview

TravelStreamz now supports **Zora token creation**, allowing users to launch their own tokens directly from the platform using the Zora SDK. This feature enables content creators and travelers to tokenize their experiences, locations, or communities.

## Features

### 🪙 Token Creation
- **Custom Token Names**: Create tokens with personalized names (e.g., "Bali Travel Token")
- **Unique Symbols**: Choose token symbols (2-10 characters, e.g., $BALI)
- **Metadata Support**: Link to custom metadata URIs for token images and descriptions
- **Market Cap Options**: Select starting market cap (Low, Medium, High)
- **Multi-Chain Support**: Deploy on Base, Base Sepolia, Ethereum, Optimism, or Zora Network

### 🔗 Supported Networks
- **Base Sepolia** (84532) - Testnet
- **Base** (8453) - Mainnet
- **Ethereum** (1) - Mainnet
- **Optimism** (10) - Mainnet
- **Zora** (7777777) - Mainnet

## How to Use

### 1. Access Token Creation
1. Open the **Trading Panel** (click the $ button on the right side)
2. Click the purple **"Create Your Token"** button at the top
3. The Token Creation Modal will open

### 2. Fill in Token Details

**Required Fields:**
- **Network**: Select the blockchain network (default: Base Sepolia)
- **Token Name**: Full name of your token (e.g., "Bali Travel Token")
- **Token Symbol**: Short symbol (2-10 characters, e.g., "BALI")
- **Metadata URI**: URL to your token's metadata JSON file
- **Starting Market Cap**: Choose Low, Medium, or High

**Example Metadata URI:**
```
https://example.com/metadata.json
```

Your metadata JSON should look like:
```json
{
  "name": "Bali Travel Token",
  "description": "Token for Bali travel experiences",
  "image": "https://example.com/images/bali.png",
  "attributes": [
    {
      "trait_type": "Location",
      "value": "Bali, Indonesia"
    },
    {
      "trait_type": "Category",
      "value": "Travel"
    }
  ]
}
```

### 3. Create and Deploy

1. **Prepare Token**: Click "Prepare Token Creation"
   - The system validates your inputs
   - Calls Zora API to generate transaction data
   - Shows "Ready to Deploy" status

2. **Execute Transaction**: Click "Execute Transaction"
   - Connects to your wallet
   - Prompts you to sign the transaction
   - Deploys your token on-chain

3. **Confirmation**: 
   - Transaction is sent to the blockchain
   - You'll see a confirmation with a BaseScan link
   - Your token is now live!

## Technical Implementation

### Components

#### `TokenCreationModal.tsx`
Modal component with form for token creation
- Input validation
- Wallet connection check
- Transaction execution
- Success/error handling

#### `zoraService.ts`
Service layer for Zora API integration
- API calls to Zora endpoint
- Parameter validation
- Type definitions
- Chain support utilities

### API Integration

**Endpoint**: `POST https://api.zora.co/api/create/content`

**Authentication**: Bearer token (API key)

**Request Format**:
```typescript
{
  creator: "0x...",          // Wallet address
  name: "Token Name",
  symbol: "SYMBOL",
  metadata: {
    type: "RAW_URI",
    uri: "https://..."
  },
  currency: "CREATOR_COIN",
  chainId: 84532,
  startingMarketCap: "LOW",
  smartWalletRouting: "AUTO"
}
```

**Response Format**:
```typescript
{
  calls: [
    {
      to: "0x...",
      data: "0x...",
      value: "0"
    }
  ]
}
```

## Environment Setup

### Required Environment Variables

Add to your `.env` file:
```bash
VITE_ZORA_API_KEY=your_zora_api_key_here
```

Get your API key from: https://docs.zora.co/api/

### Configuration Files

1. **`.env`** - Local development
2. **`.env.production`** - Production deployment
3. **`.env.example`** - Template for team members

## Validation Rules

### Token Name
- ✅ Required
- ✅ Must not be empty
- ⚠️ No minimum/maximum length specified by Zora

### Token Symbol
- ✅ Required
- ✅ 2-10 characters
- ✅ Automatically converted to uppercase
- ✅ No special characters recommended

### Metadata URI
- ✅ Required
- ✅ Must be valid HTTP/HTTPS URL
- ✅ Should point to valid JSON metadata
- ⚠️ Must be publicly accessible

### Creator Address
- ✅ Must be valid Ethereum address (0x...)
- ✅ Automatically filled from connected wallet
- ✅ Must have sufficient gas for deployment

## User Flow

```
1. User clicks "Create Your Token"
   ↓
2. Modal opens with form
   ↓
3. User fills in token details
   ↓
4. User clicks "Prepare Token Creation"
   ↓
5. System validates inputs
   ↓
6. Zora API returns transaction data
   ↓
7. User clicks "Execute Transaction"
   ↓
8. Wallet prompts for signature
   ↓
9. Transaction sent to blockchain
   ↓
10. Confirmation & BaseScan link shown
```

## Error Handling

### Common Errors

**"Wallet not connected"**
- Solution: Connect wallet before creating token

**"Invalid creator address"**
- Solution: Ensure wallet is properly connected

**"Token symbol must be between 2 and 10 characters"**
- Solution: Use a shorter/longer symbol

**"Valid metadata URI is required"**
- Solution: Provide a proper HTTPS URL

**"Zora API key not configured"**
- Solution: Add `VITE_ZORA_API_KEY` to `.env`

**"Failed to create token"**
- Check API key validity
- Verify network connectivity
- Check Zora API status

## Best Practices

### 1. Metadata Preparation
- Host metadata on IPFS or permanent storage
- Include high-quality images (512x512 or larger)
- Add relevant attributes/traits
- Ensure JSON is valid

### 2. Token Naming
- Use clear, descriptive names
- Make symbols memorable and relevant
- Check for existing similar tokens
- Consider your brand/community

### 3. Network Selection
- Use **Base Sepolia** for testing
- Use **Base** for production (lower fees)
- Consider target audience location
- Check gas prices before deploying

### 4. Market Cap
- **Low**: For experimental/community tokens
- **Medium**: For established projects
- **High**: For major launches with backing

## Integration with TravelStreamz

### Use Cases

1. **Location Tokens**: Create tokens for specific travel destinations
   - $BALI, $VEGAS, $DUBAI, etc.
   - Tie to location-specific content

2. **Creator Tokens**: Content creators can launch personal tokens
   - Monetize their travel content
   - Build engaged communities

3. **Experience Tokens**: Tokenize unique travel experiences
   - Specific tours, activities, or events
   - Limited edition experiences

4. **Betting Integration**: Use created tokens in slot machine betting
   - Bet on video-token matches
   - Earn rewards with custom tokens

## Future Enhancements

- [ ] Batch token creation
- [ ] Token portfolio management
- [ ] Trading interface for created tokens
- [ ] Analytics dashboard
- [ ] Token staking features
- [ ] Community voting with tokens
- [ ] Airdrops and rewards distribution

## Resources

- **Zora API Docs**: https://docs.zora.co/api/
- **Zora Dashboard**: https://zora.co/
- **Base Docs**: https://docs.base.org/
- **BaseScan**: https://basescan.org/

## Support

For issues with token creation:
1. Check the browser console for errors
2. Verify your API key is correct
3. Ensure wallet has sufficient gas
4. Check network connectivity
5. Review Zora API status

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Key Protection**
   - Never commit API keys to Git
   - Use environment variables only
   - Rotate keys regularly

2. **Transaction Safety**
   - Always verify transaction details
   - Check token parameters before deploying
   - Test on testnet first (Base Sepolia)

3. **Metadata Security**
   - Use HTTPS URLs only
   - Verify metadata content
   - Use IPFS for permanent storage

4. **Wallet Safety**
   - Only connect to trusted sites
   - Review all transaction prompts
   - Keep wallet secure
