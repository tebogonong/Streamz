import { VideoContent } from "@/types/video";
import { TrendingUp, TrendingDown, Users, DollarSign, Flame, Award, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

interface VideoCardProps {
  video: VideoContent;
  onVideoEnd?: () => void;
  onVideoLoaded?: (videoId: string) => void;
}

export const VideoCard = ({ video, onVideoEnd, onVideoLoaded }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quality, setQuality] = useState<'auto' | 'low'>('auto');
  const loadStartTime = useRef<number>(0);
  const deviceInfo = useDeviceCapabilities();

  // Detect low-end device
  useEffect(() => {
    if (deviceInfo.isLowEnd) {
      setQuality('low');
      console.log('📱 Low-end device detected - Optimizing playback');
    }
  }, [deviceInfo.isLowEnd]);

  useEffect(() => {
    if (videoRef.current) {
      // Reset loaded state when video changes
      setIsLoaded(false);
      loadStartTime.current = performance.now();
      
      // Low-end device optimizations
      if (quality === 'low') {
        videoRef.current.playbackRate = 1.0;
        videoRef.current.preload = 'metadata';
      } else {
        videoRef.current.preload = 'auto';
      }
      
      // Load the video
      videoRef.current.load();
      
      // Attempt to play with proper error handling
      const attemptPlay = () => {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              // Silently handle autoplay errors - browser policy
              if (err.name !== 'AbortError') {
                console.log("Playback issue:", err.name);
              }
            });
          }
        }
      };

      // Small delay to ensure video is ready
      const timer = setTimeout(attemptPlay, 100);
      
      return () => clearTimeout(timer);
    }
  }, [video.id, quality]);

  const handleCanPlay = () => {
    setIsLoaded(true);
    const loadTime = performance.now() - loadStartTime.current;
    console.log(`⚡ Video loaded in ${loadTime.toFixed(0)}ms - ${video.location.name}`);
    
    // Notify parent that video is loaded
    if (onVideoLoaded) {
      onVideoLoaded(video.id);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    // Silently handle video loading errors to prevent console spam
    // This is expected behavior when videos are not yet uploaded to Supabase
    setIsLoaded(true); // Show content overlay even if video fails to load
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const isPositiveChange = video.token.change24h >= 0;

  return (
    <div className="absolute inset-0">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={video.videoUrl}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          onCanPlay={handleCanPlay}
          onCanPlayThrough={handleCanPlay}
          onLoadedData={handleCanPlay}
          onEnded={onVideoEnd}
          onError={handleError}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-4 md:p-6 pb-32 sm:pb-36 md:pb-32">
        {/* Top Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <img
              src={video.creator.avatar}
              alt={video.creator.username}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-primary shadow-glow flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-foreground text-sm sm:text-base truncate">{video.creator.username}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {video.location.name}, {video.location.country}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Award className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{video.creator.xpPoints.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-pink-400">
                  <Heart className="w-3 h-3 flex-shrink-0" />
                  <span>{formatNumber(video.likes)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {video.streamTags?.slice(0, window.innerWidth < 640 ? 2 : 3).map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs bg-primary/20 backdrop-blur-sm px-2 py-0.5"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Virality Score */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-viral px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex-shrink-0">
            <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm">{video.viralityScore}</span>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="space-y-3 sm:space-y-4">
          {/* Token Metrics */}
          <div className="bg-card/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3 shadow-card border border-border max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Token</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">${video.token.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">${video.token.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
              <div className="flex items-center gap-1">
                {isPositiveChange ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-crypto-green flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-crypto-red flex-shrink-0" />
                )}
                <span className={isPositiveChange ? "text-crypto-green" : "text-crypto-red"}>
                  {isPositiveChange ? "+" : ""}
                  {video.token.change24h.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Vol: ${formatNumber(video.token.volume)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{formatNumber(video.token.holders)}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Views</p>
              <p className="font-bold text-foreground">{formatNumber(video.views)}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-1">XP Earned</p>
              <p className="font-bold text-yellow-400">+{video.xpEarned || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Betting Pool</p>
              <p className="font-bold text-foreground">${formatNumber(video.bettingPool)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
