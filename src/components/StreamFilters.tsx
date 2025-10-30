import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X, Filter } from "lucide-react";
import { VideoCategory } from "@/types/video";

const CATEGORIES: VideoCategory[] = ['safety', 'fun', 'shopping', 'food', 'culture', 'nightlife', 'adventure', 'nature'];

interface StreamFiltersProps {
  selectedCategories: VideoCategory[];
  onCategoryToggle: (category: VideoCategory) => void;
  locationSearch: string;
  onLocationSearch: (location: string) => void;
  onClearFilters: () => void;
}

export const StreamFilters = ({
  selectedCategories,
  onCategoryToggle,
  locationSearch,
  onLocationSearch,
  onClearFilters,
}: StreamFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="absolute top-36 sm:top-44 md:top-32 mid:top-48 left-0 right-0 z-20 px-3 sm:px-4 space-y-3 lg:hidden">
      {/* Improved Search Bar with better spacing and 60% smaller size on mobile/tablet */}
      <div className="flex gap-2 sm:gap-2 max-w-[60%] sm:max-w-[60%] md:max-w-lg mx-auto md:w-[calc(60%-4rem)]">
        <div className="relative flex-1">
          <Search className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search location..."
            value={locationSearch}
            onChange={(e) => onLocationSearch(e.target.value)}
            className="pl-6 sm:pl-8 pr-6 sm:pr-8 bg-card/90 backdrop-blur-sm text-xs sm:text-xs h-7 sm:h-8 border-white/20 rounded-lg sm:rounded-xl w-full mx-auto"
            onFocus={() => setShowFilters(true)}
          />
          {locationSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0.5 sm:right-0.5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6"
              onClick={() => onLocationSearch("")}
            >
              <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
          )}
        </div>
        
        {/* Filter Toggle Button with improved spacing */}
        <Button
          variant="outline"
          size="icon"
          className={`h-7 w-7 sm:h-8 sm:w-8 bg-card/90 backdrop-blur-sm border-white/20 rounded-lg sm:rounded-xl flex-shrink-0 ${
            showFilters ? 'bg-primary/20 border-primary/40' : ''
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </Button>
      </div>

      {/* Category Filters with improved layout and 60% smaller size on mobile/tablet */}
      {showFilters && (
        <div className="bg-card/95 backdrop-blur-sm rounded-xl p-3 sm:p-3 space-y-3 border border-white/10 max-w-[60%] sm:max-w-[60%] md:max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-medium">Categories</span>
            </div>
            {(selectedCategories.length > 0 || locationSearch) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-6 text-xs px-2"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {/* Improved category grid with better spacing and smaller size */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-1.5">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform capitalize text-xs px-2 py-1 justify-center text-center"
                onClick={() => onCategoryToggle(category)}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <X className="w-2.5 h-2.5 ml-1" />
                )}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full h-7 text-xs"
            onClick={() => setShowFilters(false)}
          >
            Apply Filters
          </Button>
        </div>
      )}

      {/* Active Filters Display with better spacing */}
      {!showFilters && (selectedCategories.length > 0 || locationSearch) && (
        <div className="flex items-center gap-2 flex-wrap">
          {locationSearch && (
            <Badge variant="secondary" className="gap-1 text-xs px-2 py-1">
              <MapPin className="w-3 h-3" />
              <span className="max-w-[100px] sm:max-w-none truncate">{locationSearch}</span>
            </Badge>
          )}
          {selectedCategories.slice(0, 3).map((category) => (
            <Badge key={category} variant="secondary" className="capitalize gap-1 text-xs px-2 py-1">
              {category}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onCategoryToggle(category)}
              />
            </Badge>
          ))}
          {selectedCategories.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              +{selectedCategories.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
