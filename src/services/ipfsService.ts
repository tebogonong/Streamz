// IPFS Service for uploading images and metadata to Pinata
// Documentation: https://docs.pinata.cloud/

export interface IPFSUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

// Debug logging
console.log('🔧 Pinata Configuration:', {
  hasJWT: !!PINATA_JWT,
  hasAPIKey: !!PINATA_API_KEY,
  hasAPISecret: !!PINATA_API_SECRET,
  jwtLength: PINATA_JWT?.length,
});

/**
 * Upload an image file to IPFS via Pinata
 * @param file The image file to upload
 * @param filename Optional custom filename
 * @returns IPFS hash and gateway URL
 */
export async function uploadImageToIPFS(
  file: File,
  filename?: string
): Promise<{ ipfsHash: string; gatewayUrl: string }> {
  if (!PINATA_JWT && !PINATA_API_KEY) {
    throw new Error('Pinata credentials not configured. Please add VITE_PINATA_JWT or VITE_PINATA_API_KEY to your .env file.');
  }

  console.log('📤 Uploading image to IPFS...', {
    filename: filename || file.name,
    size: file.size,
    type: file.type,
    usingJWT: !!PINATA_JWT,
  });

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add metadata
    const metadata = JSON.stringify({
      name: filename || file.name,
    });
    formData.append('pinataMetadata', metadata);

    // Add options
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    // Use JWT auth if available, otherwise use API key
    const headers: HeadersInit = PINATA_JWT
      ? { Authorization: `Bearer ${PINATA_JWT}` }
      : {
          pinata_api_key: PINATA_API_KEY!,
          pinata_secret_api_key: PINATA_API_SECRET!,
        };

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.details || 'Failed to upload image to IPFS');
    }

    const data: IPFSUploadResponse = await response.json();
    
    return {
      ipfsHash: data.IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw error;
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param metadata Token metadata object
 * @param name Optional name for the metadata
 * @returns IPFS hash and gateway URL
 */
export async function uploadMetadataToIPFS(
  metadata: TokenMetadata,
  name?: string
): Promise<{ ipfsHash: string; gatewayUrl: string }> {
  if (!PINATA_JWT && !PINATA_API_KEY) {
    throw new Error('Pinata credentials not configured. Please add VITE_PINATA_JWT or VITE_PINATA_API_KEY to your .env file.');
  }

  try {
    // Use JWT auth if available, otherwise use API key
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(PINATA_JWT
        ? { Authorization: `Bearer ${PINATA_JWT}` }
        : {
            pinata_api_key: PINATA_API_KEY!,
            pinata_secret_api_key: PINATA_API_SECRET!,
          }),
    };

    const body = JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: name || metadata.name || 'Token Metadata',
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.details || 'Failed to upload metadata to IPFS');
    }

    const data: IPFSUploadResponse = await response.json();
    
    return {
      ipfsHash: data.IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}

/**
 * Upload both image and metadata to IPFS
 * @param imageFile The token image file
 * @param tokenName Token name
 * @param tokenDescription Token description
 * @param attributes Optional token attributes
 * @returns Metadata URI (IPFS gateway URL)
 */
export async function uploadTokenToIPFS(
  imageFile: File,
  tokenName: string,
  tokenDescription: string,
  attributes?: Array<{ trait_type: string; value: string | number }>
): Promise<string> {
  try {
    // Step 1: Upload image to IPFS
    console.log('📤 Uploading image to IPFS...');
    const imageUpload = await uploadImageToIPFS(imageFile, `${tokenName}-image`);
    console.log('✅ Image uploaded:', imageUpload.gatewayUrl);

    // Step 2: Create metadata with image IPFS URL
    const metadata: TokenMetadata = {
      name: tokenName,
      description: tokenDescription,
      image: imageUpload.gatewayUrl,
      attributes,
    };

    // Step 3: Upload metadata to IPFS
    console.log('📤 Uploading metadata to IPFS...');
    const metadataUpload = await uploadMetadataToIPFS(metadata, `${tokenName}-metadata`);
    console.log('✅ Metadata uploaded:', metadataUpload.gatewayUrl);

    // Return the metadata URI
    return metadataUpload.gatewayUrl;
  } catch (error) {
    console.error('Error in uploadTokenToIPFS:', error);
    throw error;
  }
}

/**
 * Validate image file
 * @param file File to validate
 * @returns Error message if invalid, null if valid
 */
export function validateImageFile(file: File): string | null {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Please upload a JPEG, PNG, GIF, WebP, or SVG image.';
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return 'File too large. Maximum size is 10MB.';
  }

  return null;
}

/**
 * Get IPFS gateway URL from hash
 * @param ipfsHash IPFS hash (CID)
 * @returns Gateway URL
 */
export function getIPFSGatewayUrl(ipfsHash: string): string {
  // Remove ipfs:// prefix if present
  const hash = ipfsHash.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

/**
 * Check if Pinata is configured
 * @returns true if credentials are available
 */
export function isPinataConfigured(): boolean {
  return !!(PINATA_JWT || (PINATA_API_KEY && PINATA_API_SECRET));
}
