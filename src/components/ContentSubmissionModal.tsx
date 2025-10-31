import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Coins, Upload } from "lucide-react";
import { VideoCategory } from "@/types/video";
import { useToast } from "@/hooks/use-toast";
import { BasePay } from "./BasePay";
import { TokenCreationModal } from "./TokenCreationModal";
import { useAccount } from "wagmi";

const CATEGORIES: VideoCategory[] = ['safety', 'fun', 'shopping', 'food', 'culture', 'nightlife', 'adventure', 'nature'];

export const ContentSubmissionModal = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [embedUrl, setEmbedUrl] = useState("");
  const [location, setLocation] = useState("");
  const { isConnected } = useAccount();
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);
  const { toast } = useToast();

  const toggleCategory = (category: VideoCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!embedUrl || !location || selectedCategories.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select at least one category",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Content Submitted! 🎉",
      description: `Your content will be added to ${location} stream with ${selectedCategories.length} tags`,
    });

    // Reset form
    setEmbedUrl("");
    setLocation("");
    setSelectedCategories([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-2 left-1/4 -translate-x-1/2 sm:right-4 sm:left-auto sm:translate-x-0 sm:bottom-6 z-40 h-12 w-12 sm:h-10 sm:w-10 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-xl"
          title="Submit Content"
        >
          <Plus className="h-5 w-5 sm:h-5 sm:w-5 md:h-5 md:w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Content</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Post Video
            </TabsTrigger>
            <TabsTrigger value="token" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Create Token
            </TabsTrigger>
          </TabsList>
          
          {/* Upload Content Tab */}
          <TabsContent value="upload" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embedUrl">Content URL</Label>
                <Input
                  id="embedUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">YouTube, TikTok, Instagram, or direct video URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g. Gaborone, Lagos, Nairobi..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categories (Select at least one)</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform capitalize"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                      {selectedCategories.includes(category) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <BasePay
                amount={0.10}
                disabled={!isConnected || selectedCategories.length === 0 || !location.trim() || !embedUrl.trim()}
                onSuccess={() => {
                  toast({
                    title: "Content submitted!",
                    description: "Your video has been posted to the stream",
                  });
                  setOpen(false);
                  // Reset form
                  setEmbedUrl("");
                  setLocation("");
                  setSelectedCategories([]);
                }}
              >
                Post to Stream ($0.10)
              </BasePay>
            </form>
          </TabsContent>
          
          {/* Create Token Tab */}
          <TabsContent value="token" className="mt-4">
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Launch Your Token
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create your own token for your location, brand, or community using Zora's platform.
                  Perfect for tokenizing travel destinations or building creator economies.
                </p>
              </div>
              
              <TokenCreationModal 
                trigger={
                  <Button className="w-full" size="lg">
                    <Coins className="h-4 w-4 mr-2" />
                    Create Token with Zora
                  </Button>
                }
              />
              
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                <p className="font-medium">Examples:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Location tokens: $BALI, $PARIS, $TOKYO</li>
                  <li>Creator tokens: Build your community</li>
                  <li>Experience tokens: Tokenize unique adventures</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
