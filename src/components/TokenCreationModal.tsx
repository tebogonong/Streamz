import { useState, ReactNode, useRef } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, ExternalLink, CheckCircle, AlertCircle, Upload, Image as ImageIcon, X } from "lucide-react";
import {
  createZoraToken,
  validateTokenParams,
  SUPPORTED_CHAINS,
  getChainName,
  type ZoraTokenCreationParams,
} from "@/services/zoraService";
import {
  uploadTokenToIPFS,
  validateImageFile,
  isPinataConfigured,
} from "@/services/ipfsService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TokenCreationModalProps {
  trigger?: ReactNode;
}

export function TokenCreationModal({ trigger }: TokenCreationModalProps) {
  const { address, isConnected, chain } = useAccount();
  const { toast } = useToast();
  const { sendTransaction, data: hash, isPending: isSendingTx } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);
  const [txCalls, setTxCalls] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [metadataUri, setMetadataUri] = useState("");
  const [useManualUri, setUseManualUri] = useState(false);
  const [startingMarketCap, setStartingMarketCap] = useState<"LOW" | "HIGH">("LOW");
  const [selectedChainId, setSelectedChainId] = useState(SUPPORTED_CHAINS.BASE_SEPOLIA.toString());

  const resetForm = () => {
    setTokenName("");
    setTokenSymbol("");
    setTokenDescription("");
    setTokenImage(null);
    setImagePreview("");
    setMetadataUri("");
    setUseManualUri(false);
    setStartingMarketCap("LOW");
    setTxCalls(null);
    setIsUploadingToIPFS(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast({
        title: "Invalid Image",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setTokenImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setTokenImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateToken = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a token",
        variant: "destructive",
      });
      return;
    }

    let finalMetadataUri = metadataUri;

    // If not using manual URI and we have image, upload to IPFS
    if (!useManualUri && tokenImage && tokenName && tokenDescription) {
      if (!isPinataConfigured()) {
        toast({
          title: "IPFS Not Configured",
          description: "Please add Pinata credentials to .env file or use manual metadata URI",
          variant: "destructive",
        });
        return;
      }

      setIsUploadingToIPFS(true);
      try {
        toast({
          title: "Uploading to IPFS",
          description: "Uploading image and metadata to IPFS...",
        });

        // Upload image and metadata to IPFS
        finalMetadataUri = await uploadTokenToIPFS(
          tokenImage,
          tokenName,
          tokenDescription,
          [
            { trait_type: "Symbol", value: tokenSymbol.toUpperCase() },
            { trait_type: "Chain", value: getChainName(parseInt(selectedChainId)) },
          ]
        );

        toast({
          title: "IPFS Upload Complete",
          description: "Your token metadata is now on IPFS!",
        });

        setMetadataUri(finalMetadataUri);
      } catch (error: any) {
        toast({
          title: "IPFS Upload Failed",
          description: error.message || "Failed to upload to IPFS",
          variant: "destructive",
        });
        setIsUploadingToIPFS(false);
        return;
      } finally {
        setIsUploadingToIPFS(false);
      }
    }

    // Validate we have a metadata URI
    if (!finalMetadataUri) {
      toast({
        title: "Missing Metadata",
        description: "Please upload an image or provide a metadata URI",
        variant: "destructive",
      });
      return;
    }

    const params: ZoraTokenCreationParams = {
      creator: address,
      name: tokenName,
      symbol: tokenSymbol.toUpperCase(),
      metadata: {
        type: "RAW_URI",
        uri: finalMetadataUri,
      },
      // Base Sepolia only supports ETH currency
      currency: parseInt(selectedChainId) === 84532 ? "ETH" : "CREATOR_COIN",
      chainId: parseInt(selectedChainId),
      startingMarketCap,
    };

    // Validate parameters
    const errors = validateTokenParams(params);
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Call Zora API to get transaction calls
      const response = await createZoraToken(params);
      setTxCalls(response.calls);

      toast({
        title: "Token Creation Ready",
        description: "Review the transaction details and confirm to create your token",
      });
    } catch (error: any) {
      console.error("Error creating token:", error);
      toast({
        title: "Token Creation Failed",
        description: error.message || "Failed to create token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleExecuteTransaction = async () => {
    if (!txCalls || txCalls.length === 0) {
      toast({
        title: "No transaction to execute",
        description: "Please create token parameters first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Execute the first transaction call
      // Note: If there are multiple calls, you may need to batch them
      const call = txCalls[0];
      
      sendTransaction({
        to: call.to as `0x${string}`,
        data: call.data as `0x${string}`,
        value: BigInt(call.value || "0"),
      });
    } catch (error: any) {
      console.error("Error executing transaction:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to execute transaction",
        variant: "destructive",
      });
    }
  };

  // Handle successful transaction
  if (isSuccess && hash) {
    setTimeout(() => {
      toast({
        title: "Token Created Successfully! 🎉",
        description: (
          <div className="flex flex-col gap-2">
            <p>Your token has been created on {getChainName(parseInt(selectedChainId))}</p>
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-1"
            >
              View on BaseScan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ),
      });
      resetForm();
      setOpen(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Coins className="w-4 h-4" />
            Create Token
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Create Your Token
          </DialogTitle>
          <DialogDescription>
            Launch your own token on {getChainName(parseInt(selectedChainId))} using Zora
          </DialogDescription>
        </DialogHeader>

        {!isConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Required</AlertTitle>
            <AlertDescription>
              Please connect your wallet to create a token
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 py-4">
            {/* Chain Selection */}
            <div className="space-y-2">
              <Label htmlFor="chain">Network</Label>
              <Select value={selectedChainId} onValueChange={setSelectedChainId}>
                <SelectTrigger id="chain">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_CHAINS).map(([name, chainId]) => (
                    <SelectItem key={chainId} value={chainId.toString()}>
                      {name.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Token Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                placeholder="e.g., Bali Travel Token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                disabled={isCreating || isSendingTx}
              />
            </div>

            {/* Token Symbol */}
            <div className="space-y-2">
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., BALI"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                maxLength={10}
                disabled={isCreating || isSendingTx || isUploadingToIPFS}
              />
              <p className="text-xs text-muted-foreground">
                2-10 characters, will be converted to uppercase
              </p>
            </div>

            {/* Token Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Token Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your token and what it represents..."
                value={tokenDescription}
                onChange={(e) => setTokenDescription(e.target.value)}
                disabled={isCreating || isSendingTx || isUploadingToIPFS}
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Token Image</Label>
              <div className="space-y-3">
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs">PNG, JPG, GIF, WebP, or SVG (max 10MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Token preview"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                      disabled={isCreating || isSendingTx || isUploadingToIPFS}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isCreating || isSendingTx || isUploadingToIPFS}
                />
              </div>
              {isPinataConfigured() ? (
                <p className="text-xs text-muted-foreground">
                  ✅ Image will be uploaded to IPFS automatically
                </p>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    IPFS not configured. Add VITE_PINATA_JWT to .env for auto-upload
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Manual Metadata URI Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="manualUri"
                checked={useManualUri}
                onChange={(e) => setUseManualUri(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="manualUri" className="text-sm font-normal cursor-pointer">
                Use manual metadata URI instead
              </Label>
            </div>

            {/* Manual Metadata URI (optional) */}
            {useManualUri && (
              <div className="space-y-2">
                <Label htmlFor="metadata">Metadata URI</Label>
                <Input
                  id="metadata"
                  placeholder="https://example.com/metadata.json or ipfs://..."
                  value={metadataUri}
                  onChange={(e) => setMetadataUri(e.target.value)}
                  disabled={isCreating || isSendingTx || isUploadingToIPFS}
                />
                <p className="text-xs text-muted-foreground">
                  URL to your token's metadata (image, description, etc.)
                </p>
              </div>
            )}

            {/* Starting Market Cap */}
            <div className="space-y-2">
              <Label htmlFor="marketcap">Starting Market Cap</Label>
              <Select
                value={startingMarketCap}
                onValueChange={(value: any) => setStartingMarketCap(value)}
                disabled={isCreating || isSendingTx}
              >
                <SelectTrigger id="marketcap">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low (~0.01 ETH)</SelectItem>
                  <SelectItem value="HIGH">High (~1 ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction Info */}
            {txCalls && txCalls.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Ready to Deploy</AlertTitle>
                <AlertDescription>
                  Transaction prepared. Click "Execute Transaction" to create your token.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              {!txCalls ? (
                <Button
                  onClick={handleCreateToken}
                  disabled={
                    !tokenName ||
                    !tokenSymbol ||
                    (!useManualUri && !tokenImage) ||
                    (useManualUri && !metadataUri) ||
                    (!useManualUri && !tokenDescription) ||
                    isCreating ||
                    isUploadingToIPFS ||
                    !isConnected
                  }
                  className="w-full"
                >
                  {(isCreating || isUploadingToIPFS) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploadingToIPFS ? "Uploading to IPFS..." : isCreating ? "Preparing..." : "Prepare Token Creation"}
                </Button>
              ) : (
                <Button
                  onClick={handleExecuteTransaction}
                  disabled={isSendingTx || isConfirming}
                  className="w-full"
                >
                  {(isSendingTx || isConfirming) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isConfirming
                    ? "Confirming..."
                    : isSendingTx
                    ? "Sending..."
                    : "Execute Transaction"}
                </Button>
              )}

              {txCalls && (
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSendingTx || isConfirming}
                  className="w-full"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Current Wallet Info */}
            <div className="text-xs text-muted-foreground border-t pt-4">
              <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <p>Network: {chain?.name || "Unknown"}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
