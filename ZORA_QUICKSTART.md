# 🎨 Zora Token Creation - Quick Start Guide

## What Was Added

### New Components
1. **`TokenCreationModal.tsx`** - Full-featured modal for token creation
2. **`zoraService.ts`** - API service layer for Zora integration

### Updated Components
- **`ActionBar.tsx`** - Added "Create Your Token" button

### Environment Variables
- **`VITE_ZORA_API_KEY`** - Added to `.env`, `.env.production`, and `.env.example`

## Quick Start

### 1. Open Trading Panel
Click the **$** (dollar sign) button on the right side of the screen

### 2. Click "Create Your Token"
Purple button at the top of the trading panel

### 3. Fill in Token Details
```
Network: Base Sepolia (or choose another)
Token Name: Bali Travel Token
Token Symbol: BALI
Metadata URI: https://example.com/metadata.json
Starting Market Cap: Low/Medium/High
```

### 4. Deploy
1. Click "Prepare Token Creation"
2. Review transaction details
3. Click "Execute Transaction"
4. Confirm in your wallet
5. Done! 🎉

## Example Tokens You Can Create

### Location Tokens
- **$BALI** - Bali Travel Token
- **$PARIS** - Paris Experience Token
- **$TOKYO** - Tokyo Adventure Token
- **$DUBAI** - Dubai Luxury Token

### Creator Tokens
- **$TRAVELER** - Personal travel creator token
- **$EXPLORER** - Explorer community token
- **$WANDERLUST** - Travel enthusiast token

### Experience Tokens
- **$SURF** - Surf experience token
- **$DIVE** - Diving adventure token
- **$HIKE** - Hiking journey token

## API Key Setup

Your Zora API key is already configured:
```bash
VITE_ZORA_API_KEY=zora_api_8d779cf58eac46ba43a50bbead91a927cecee6fe2aec73617befec5505147c47
```

## Metadata Example

Create a JSON file hosted online:
```json
{
  "name": "Bali Travel Token",
  "description": "Experience the magic of Bali through this exclusive travel token",
  "image": "https://example.com/images/bali.png",
  "attributes": [
    {
      "trait_type": "Location",
      "value": "Bali, Indonesia"
    },
    {
      "trait_type": "Type",
      "value": "Travel Destination"
    }
  ]
}
```

## Supported Networks

| Network | Chain ID | Best For |
|---------|----------|----------|
| Base Sepolia | 84532 | Testing (free) |
| Base | 8453 | Production (low fees) |
| Ethereum | 1 | Maximum reach |
| Optimism | 10 | L2 efficiency |
| Zora | 7777777 | Creator focus |

## Common Issues

### "Wallet not connected"
**Fix**: Click the wallet icon (top-right) and connect

### "Invalid metadata URI"
**Fix**: Use a valid HTTPS URL (not HTTP)

### "Token symbol must be between 2 and 10 characters"
**Fix**: Use shorter/longer symbol (e.g., "BLI" or "BALI")

### "Failed to create token"
**Fix**: Check your API key in `.env` file

## Testing Workflow

1. **Test on Base Sepolia first** (free gas)
2. Get test ETH from [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
3. Create test token
4. Verify on BaseScan
5. Deploy to mainnet when ready

## Next Steps

After creating your token:
1. ✅ Share the BaseScan link
2. ✅ Add token to video content
3. ✅ Enable betting with your token
4. ✅ Build community around it
5. ✅ Track performance

## Full Documentation

For detailed information, see:
- **[ZORA_INTEGRATION.md](./ZORA_INTEGRATION.md)** - Complete integration guide
- **[Zora API Docs](https://docs.zora.co/api/)** - Official Zora documentation

## Support

Issues? Check:
1. Browser console for errors
2. API key in `.env` file
3. Wallet connection status
4. Network selection (Base Sepolia for testing)
5. Gas balance in wallet

## File Structure

```
src/
├── components/
│   ├── TokenCreationModal.tsx  ← New component
│   └── ActionBar.tsx            ← Updated with button
└── services/
    └── zoraService.ts           ← New service

.env                              ← Updated with API key
.env.production                   ← Updated with API key
.env.example                      ← Updated with API key
ZORA_INTEGRATION.md               ← New documentation
```

## Code Example

Using the service directly:
```typescript
import { createZoraToken } from '@/services/zoraService';

const response = await createZoraToken({
  creator: '0x...',
  name: 'Bali Travel Token',
  symbol: 'BALI',
  metadata: {
    type: 'RAW_URI',
    uri: 'https://example.com/metadata.json'
  },
  currency: 'CREATOR_COIN',
  chainId: 84532,
  startingMarketCap: 'LOW',
  smartWalletRouting: 'AUTO'
});
```

## Success Indicators

✅ "Token Creation Ready" toast appears  
✅ Transaction details shown  
✅ Wallet prompts for signature  
✅ "Token Created Successfully! 🎉" confirmation  
✅ BaseScan link provided  

## Pro Tips

💡 **Use IPFS** for permanent metadata storage  
💡 **Test first** on Base Sepolia (free)  
💡 **Optimize images** to 512x512 or 1024x1024  
💡 **Choose memorable symbols** (3-5 characters ideal)  
💡 **Document your token** with clear descriptions  

---

**Ready to launch your token? Open the Trading Panel and get started! 🚀**
