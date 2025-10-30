import { useState } from "react";
import { VideoFeed } from "@/components/VideoFeed";
import { MultiStreamViewer } from "@/components/MultiStreamViewer";
import { SlotMachineViewer } from "@/components/SlotMachineViewer";
import { StreamSelector } from "@/components/StreamSelector";
import { ConnectWallet } from "@/components/ConnectWallet";
import { mockStreams, streamTags } from "@/data/mockStreams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Layers, 
  Grid3x3, 
  Sparkles, 
  Menu, 
  Settings, 
  Play,
  Maximize2,
  Columns2,
  Columns3,
  Filter,
  Home,
  ArrowLeft,
  Tv,
  Bell,
  Search,
  X,
  MapPin
} from "lucide-react";
import { VideoCategory } from "@/types/video";

const CATEGORIES: VideoCategory[] = ['safety', 'fun', 'shopping', 'food', 'culture', 'nightlife', 'adventure', 'nature'];

const Index = () => {
  const [viewMode, setViewMode] = useState<'classic' | 'streams' | 'slots'>('classic');
  const [selectedStreamTags, setSelectedStreamTags] = useState<string[]>(['Bali']);
  const [streamViewMode, setStreamViewMode] = useState<'single' | 'split-2' | 'split-3'>('single');
  const [locationSearch, setLocationSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);

  const onLocationSearch = (location: string) => {
    setLocationSearch(location);
  };

  const onCategoryToggle = (category: VideoCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const onClearFilters = () => {
    setLocationSearch("");
    setSelectedCategories([]);
  };

  const handleTagSelect = (tagName: string) => {
    setSelectedStreamTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      }
      return [...prev, tagName];
    });
  };

  const selectedStreams = mockStreams.filter(stream => 
    selectedStreamTags.includes(stream.tag.name)
  );

  return (
    <div className="min-h-screen bg-background relative">
      {/* Back Button - Show when not in classic mode */}
      {viewMode !== 'classic' && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={() => setViewMode('classic')}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full backdrop-blur-sm bg-black/60 border-white/20 hover:bg-black/80 shadow-lg"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Mobile: Vertical Left Navigation Bar */}
      <div className="fixed left-0 top-0 bottom-0 w-12 sm:w-14 md:w-16 bg-black/90 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col items-center py-3 sm:py-4 md:py-6 lg:hidden">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center mb-3 sm:mb-4 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* View Mode Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center mb-3 sm:mb-4 transition-colors">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="ml-2 sm:ml-3">
            <DropdownMenuItem 
              onClick={() => setViewMode('streams')}
              className={viewMode === 'streams' ? 'bg-purple-600/20' : ''}
            >
              <Play className="w-4 h-4 mr-2" />
              Live Streams
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => setViewMode('slots')}
              className={viewMode === 'slots' ? 'bg-purple-600/20' : ''}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Video Slots
            </DropdownMenuItem>
            
            {viewMode === 'streams' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Stream Layout</DropdownMenuLabel>
                
                <DropdownMenuItem 
                  onClick={() => setStreamViewMode('single')}
                  className={`text-xs ${streamViewMode === 'single' ? 'bg-accent' : ''}`}
                >
                  <Maximize2 className="w-3 h-3 mr-2" />
                  Single Stream
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setStreamViewMode('split-2')}
                  className={`text-xs ${streamViewMode === 'split-2' ? 'bg-accent' : ''}`}
                >
                  <Columns2 className="w-3 h-3 mr-2" />
                  Split View (2)
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setStreamViewMode('split-3')}
                  className={`text-xs ${streamViewMode === 'split-3' ? 'bg-accent' : ''}`}
                >
                  <Columns3 className="w-3 h-3 mr-2" />
                  Triple View (3)
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-black/95 backdrop-blur-xl border-white/10">
            <SheetHeader>
              <SheetTitle className="text-white">Settings</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Tv className="w-4 h-4 mr-2" />
                    Choose Streams
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Select Streams</SheetTitle>
                  </SheetHeader>
                  <StreamSelector 
                    tags={streamTags}
                    selectedTags={selectedStreamTags}
                    onTagSelect={handleTagSelect}
                    maxSelection={3}
                  />
                </SheetContent>
              </Sheet>
              
              <Button variant="outline" className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Content Filters
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Quality Settings
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen bg-background relative">
        
        {/* Desktop: Top Navigation */}
        <div className="hidden lg:block absolute top-2 left-4 right-4 z-50">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand */}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                TravelStreamz
              </h1>
            </div>
            
            {/* Center: Search and Filter */}
            <div className="flex items-center gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search location..."
                  value={locationSearch}
                  onChange={(e) => onLocationSearch(e.target.value)}
                  className="pl-10 pr-10 bg-card/90 backdrop-blur-sm text-sm h-10 border-white/20 rounded-xl"
                  onFocus={() => setShowFilters(true)}
                />
                {locationSearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => onLocationSearch("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className={`h-10 w-10 bg-card/90 backdrop-blur-sm border-white/20 rounded-xl flex-shrink-0 ${
                  showFilters ? 'bg-primary/20 border-primary/40' : ''
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Right: Settings & Connect Wallet */}
            <div className="flex items-center gap-3">
              <ConnectWallet />
              
              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-9 w-9 rounded-full backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <DropdownMenuLabel className="text-sm">Stream Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-sm">
                        <Layers className="w-4 h-4 mr-2" />
                        Choose Streams
                      </DropdownMenuItem>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Choose Your Streams</SheetTitle>
                        <SheetDescription>
                          Select up to 3 streams to watch simultaneously
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <StreamSelector
                          tags={streamTags}
                          selectedTags={selectedStreamTags}
                          onTagSelect={handleTagSelect}
                          maxSelection={3}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  <DropdownMenuItem className="text-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Content Filters
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="text-sm text-muted-foreground">
                    <Tv className="w-4 h-4 mr-2" />
                    Quality Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="text-sm text-muted-foreground">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Desktop: Category Filters */}
        {showFilters && (
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4 space-y-4 border border-white/10 max-w-md w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                {(selectedCategories.length > 0 || locationSearch) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-7 text-xs px-3"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors capitalize"
                    onClick={() => onCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile: Connect Wallet (Top Right) */}
        <div className="fixed top-3 right-3 z-50 sm:hidden">
          <div className="flex flex-col gap-3">
            <ConnectWallet />
          </div>
        </div>
        
        {/* Floating Action Button - Sparkles (Center) - Mobile: bottom center, Desktop: right side */}
        <Button
          onClick={() => setViewMode('slots')}
          size="lg"
          className={`fixed bottom-2 left-1/2 -translate-x-1/2 sm:right-4 sm:left-auto sm:translate-x-0 sm:bottom-6 z-40 h-12 w-12 sm:h-10 sm:w-10 md:h-10 md:w-10 rounded-full shadow-xl transition-all duration-300 ${
            viewMode === 'slots'
              ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 hover:scale-110 ring-2 ring-yellow-300/50'
              : 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 hover:scale-105'
          }`}
          title="Slot Machine Mode"
        >
          <Sparkles className="h-5 w-5 sm:h-5 sm:w-5 md:h-5 md:w-5" />
        </Button>
        
        {/* Main Content */}
        <div className="ml-12 sm:ml-14 md:ml-16 lg:ml-0 lg:pt-20">
          {viewMode === 'slots' ? (
            <SlotMachineViewer 
              streams={mockStreams.slice(0, 3)} 
              onBack={() => setViewMode('classic')}
            />
          ) : viewMode === 'streams' && selectedStreams.length > 0 ? (
            <MultiStreamViewer 
              availableStreams={mockStreams}
              initialMode={streamViewMode}
              onBack={() => setViewMode('classic')}
            />
          ) : (
            <VideoFeed />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
