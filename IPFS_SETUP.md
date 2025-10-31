# 📁 IPFS Image Upload Setup Guide

## Overview

The token creation modal now supports automatic image upload to IPFS using Pinata! Users can upload token images directly, and they'll be stored permanently on IPFS with automatically generated metadata.

## ✨ New Features

### Image Upload
- 📤 Drag & drop or click to upload token images
- 🖼️ Image preview before creation
- ✅ Automatic validation (file type & size)
- 🗑️ Easy removal and replacement
- 📝 Token description field for metadata

### IPFS Integration
- ☁️ Automatic upload to IPFS via Pinata
- 🔗 Generates proper metadata URI
- 🎨 Supports PNG, JPG, GIF, WebP, and SVG
- 📦 Max file size: 10MB
- 🌐 Uses Pinata's reliable IPFS gateway

### Best Practices
- ✅ Follows ERC-721 metadata standard
- ✅ Includes token attributes (symbol, chain)
- ✅ Permanent decentralized storage
- ✅ Fast global CDN delivery

## 🔧 Setup Instructions

### Option 1: Get Pinata JWT (Recommended)

1. **Create Pinata Account**
   - Go to [https://app.pinata.cloud/](https://app.pinata.cloud/)
   - Sign up for a free account

2. **Generate API Key**
   - Click on "API Keys" in the sidebar
   - Click "New Key" button
   - Select permissions:
     - ✅ `pinFileToIPFS`
     - ✅ `pinJSONToIPFS`
   - Name it "TravelStreamz Token Creator"
   - Click "Create Key"

3. **Copy JWT Token**
   - Copy the JWT token (starts with `eyJ...`)
   - ⚠️ Save it immediately - you won't see it again!

4. **Add to .env File**
   ```bash
   VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Option 2: Use API Key + Secret (Alternative)

If you prefer API Key + Secret instead of JWT:

1. In Pinata dashboard, generate API Key
2. Copy both the API Key and API Secret
3. Add to .env:
   ```bash
   VITE_PINATA_API_KEY=your_api_key_here
   VITE_PINATA_API_SECRET=your_api_secret_here
   ```

### Restart Dev Server

After adding credentials:
```bash
npm run dev
```

## 📋 How It Works

### User Flow

1. **Open Token Creation**
   - Click "Create Your Token" button
   - Modal opens with form

2. **Fill Token Details**
   - Enter token name (e.g., "Bali Travel Token")
   - Enter symbol (e.g., "BALI")
   - Add description (e.g., "Experience Bali...")
   - Select network and market cap

3. **Upload Image**
   - Click the upload area
   - Select image file (PNG, JPG, etc.)
   - Preview appears
   - Can remove and re-upload

4. **Create Token**
   - Click "Prepare Token Creation"
   - Image uploads to IPFS (automatic)
   - Metadata generates and uploads to IPFS
   - Transaction prepared

5. **Deploy**
   - Click "Execute Transaction"
   - Confirm in wallet
   - Token deployed with IPFS metadata! 🎉

### Technical Flow

```
1. User uploads image
   ↓
2. Image validated (type, size)
   ↓
3. User clicks "Prepare Token Creation"
   ↓
4. Image uploaded to IPFS via Pinata
   → Returns: ipfs://Qm...abc123
   ↓
5. Metadata JSON created:
   {
     "name": "Bali Travel Token",
     "description": "...",
     "image": "https://gateway.pinata.cloud/ipfs/Qm...abc123",
     "attributes": [...]
   }
   ↓
6. Metadata uploaded to IPFS
   → Returns: ipfs://Qm...xyz789
   ↓
7. Metadata URI passed to Zora API
   ↓
8. Transaction prepared and executed
```

## 🎨 Metadata Format

Generated metadata follows ERC-721 standard:

```json
{
  "name": "Bali Travel Token",
  "description": "Experience the magic of Bali...",
  "image": "https://gateway.pinata.cloud/ipfs/QmXxx",
  "attributes": [
    {
      "trait_type": "Symbol",
      "value": "BALI"
    },
    {
      "trait_type": "Chain",
      "value": "Base Sepolia"
    }
  ]
}
```

## 📁 Files Modified

### New Files
- `src/services/ipfsService.ts` - IPFS upload service with Pinata integration

### Updated Files
- `src/components/TokenCreationModal.tsx` - Added image upload UI
- `.env` - Added Pinata credentials
- `.env.example` - Added Pinata template
- `.env.production` - Added Pinata for production

### New Dependencies
- `pinata` - Official Pinata SDK for IPFS

## 🔒 Security Notes

### Environment Variables
- ✅ Pinata credentials stored in `.env` (gitignored)
- ✅ Never commit API keys to Git
- ✅ Use different keys for dev/production

### File Validation
- ✅ File type validation (images only)
- ✅ File size limit (10MB max)
- ✅ Prevents malicious uploads

### IPFS Benefits
- ✅ Decentralized storage (no single point of failure)
- ✅ Content-addressed (tamper-proof)
- ✅ Permanent storage (files never deleted)
- ✅ Fast global delivery via CDN

## 🚀 Usage Examples

### Example 1: Location Token

```
Name: Bali Travel Token
Symbol: BALI
Description: Experience the magic of Bali through this exclusive travel token
Image: [Upload sunset beach photo]
Network: Base Sepolia
Market Cap: Low
```

### Example 2: Creator Token

```
Name: TravelCreator
Symbol: TRVL
Description: Join the TravelCreator community and unlock exclusive perks
Image: [Upload profile/brand logo]
Network: Base
Market Cap: Medium
```

### Example 3: Experience Token

```
Name: Surf Adventure Pass
Symbol: SURF
Description: Access to premium surf spots and lessons worldwide
Image: [Upload surfing photo]
Network: Base
Market Cap: Low
```

## 🐛 Troubleshooting

### "IPFS Not Configured" Error
**Problem**: Pinata credentials missing
**Solution**: Add `VITE_PINATA_JWT` to `.env` file and restart server

### "Invalid Image" Error
**Problem**: File type or size not supported
**Solution**: 
- Use PNG, JPG, GIF, WebP, or SVG
- Keep file under 10MB
- Optimize large images before upload

### "Failed to Upload to IPFS" Error
**Problem**: Network or API key issue
**Solution**:
- Check internet connection
- Verify API key is correct
- Ensure key has pinning permissions
- Check Pinata service status

### Image Not Showing
**Problem**: IPFS gateway delay
**Solution**:
- Wait 30-60 seconds for propagation
- Try different gateway: `ipfs.io` or `cloudflare-ipfs.com`

## 💡 Pro Tips

### Image Optimization
1. **Resize images**: 512x512 or 1024x1024 recommended
2. **Compress files**: Use tools like TinyPNG
3. **Use PNG**: For logos and icons
4. **Use JPG**: For photos
5. **Avoid huge files**: Faster uploads, better UX

### Metadata Best Practices
1. **Clear descriptions**: Help users understand your token
2. **Add attributes**: Makes tokens more discoverable
3. **Professional images**: First impression matters
4. **Test on testnet**: Try Base Sepolia first

### Cost Optimization
1. **Free tier**: Pinata offers 1GB free
2. **Optimize images**: Smaller = cheaper
3. **Reuse metadata**: Link to existing IPFS files

## 📚 Resources

- **Pinata Docs**: https://docs.pinata.cloud/
- **IPFS Docs**: https://docs.ipfs.tech/
- **ERC-721 Standard**: https://eips.ethereum.org/EIPS/eip-721
- **Metadata Best Practices**: https://docs.opensea.io/docs/metadata-standards

## 🎉 What's Next?

Users can now:
1. ✅ Upload token images directly in the modal
2. ✅ Automatic IPFS storage (no manual setup needed)
3. ✅ Professional metadata generation
4. ✅ One-click token deployment
5. ✅ Permanent decentralized storage

No more manual IPFS uploads or JSON file creation!

---

**Need Help?**
Check the console for detailed upload progress and any errors.
