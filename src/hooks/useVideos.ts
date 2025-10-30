import { useState, useEffect } from 'react';
import { VideoContent, VideoCategory } from '@/types/video';
import { VideoService } from '@/services/videoService';
import { VideoResponse } from '@/types/database';

// Check if Supabase is configured
const hasSupabaseConfig = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('🔧 Supabase configured:', hasSupabaseConfig);

// Helper function to convert VideoResponse to VideoContent
const transformVideoResponse = (videoResponse: VideoResponse): VideoContent => {
  // Convert string categories to VideoCategory enum values
  const validCategories: VideoCategory[] = videoResponse.categories
    .filter((cat): cat is VideoCategory => 
      ['safety', 'fun', 'shopping', 'food', 'culture', 'nightlife', 'adventure', 'nature'].includes(cat)
    );

  return {
    id: videoResponse.id,
    location: videoResponse.location,
    creator: videoResponse.creator,
    videoUrl: videoResponse.videoUrl,
    thumbnailUrl: videoResponse.thumbnailUrl,
    duration: videoResponse.duration,
    views: videoResponse.views,
    likes: videoResponse.likes,
    viralityScore: videoResponse.viralityScore,
    token: videoResponse.token,
    bettingPool: videoResponse.bettingPool,
    createdAt: videoResponse.createdAt,
    paidToPost: videoResponse.paidToPost,
    categories: validCategories,
    streamTags: videoResponse.streamTags,
    xpEarned: videoResponse.xpEarned,
  };
};

export const useVideos = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchVideos = async () => {
      try {
        console.log('🔄 Fetching videos directly from Supabase...');
        setLoading(true);
        
        if (!hasSupabaseConfig) {
          throw new Error('Supabase configuration missing. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        }
        
        // Use VideoService to fetch directly from Supabase
        const videoResponses = await VideoService.getAllVideos();
        
        // Transform VideoResponse[] to VideoContent[]
        const data = videoResponses.map(transformVideoResponse);
        
        console.log('✅ Successfully fetched data from Supabase');
        console.log('📊 Video count:', data.length);
        console.log('📦 Sample video:', data[0] ? {
          id: data[0].id,
          location: data[0].location?.name,
          duration: data[0].duration
        } : 'No videos');
        
        if (isMounted) {
          setVideos(data);
          setError(null);
          console.log(`✅ Loaded ${data.length} videos directly from Supabase`);
        }
      } catch (err) {
        console.error('❌ Error fetching videos from Supabase:');
        console.error('Error type:', err instanceof Error ? err.constructor.name : typeof err);
        console.error('Error message:', err instanceof Error ? err.message : String(err));
        
        console.error('🔄 Loading fallback videos...');
        
        if (isMounted) {
          // Import and use fallback videos
          import('@/data/mockVideos').then(({ fallbackVideos }) => {
            if (isMounted) {
              setVideos(fallbackVideos);
              setError(`Using fallback videos. ${err instanceof Error ? err.message : String(err)}`);
              console.log(`📦 Loaded ${fallbackVideos.length} fallback videos`);
            }
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVideos();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only fetch once on mount

  return { videos, loading, error };
};

export const useVideosByLocation = (locationId: string) => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchVideosByLocation = async () => {
      try {
        console.log(`🔄 Fetching videos for location ${locationId} directly from Supabase...`);
        setLoading(true);
        
        if (!hasSupabaseConfig) {
          throw new Error('Supabase configuration missing. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        }
        
        // Use VideoService to fetch directly from Supabase
        const videoResponses = await VideoService.getVideosByLocation(locationId);
        
        // Transform VideoResponse[] to VideoContent[]
        const data = videoResponses.map(transformVideoResponse);
        
        if (isMounted) {
          setVideos(data);
          setError(null);
          console.log(`✅ Loaded ${data.length} videos for location ${locationId} directly from Supabase`);
        }
      } catch (err) {
        console.error(`❌ Error fetching videos for location ${locationId}:`, err);
        
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
          setVideos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (locationId) {
      fetchVideosByLocation();
    }
    
    return () => {
      isMounted = false;
    };
  }, [locationId]);

  return { videos, loading, error };
};

export const videoApi = {
  getAllVideos: async (): Promise<VideoContent[]> => {
    try {
      const videoResponses = await VideoService.getAllVideos();
      return videoResponses.map(transformVideoResponse);
    } catch (error) {
      console.error('Error fetching all videos:', error);
      throw error;
    }
  },
  
  getVideosByLocation: async (locationId: string): Promise<VideoContent[]> => {
    try {
      const videoResponses = await VideoService.getVideosByLocation(locationId);
      return videoResponses.map(transformVideoResponse);
    } catch (error) {
      console.error(`Error fetching videos for location ${locationId}:`, error);
      throw error;
    }
  },
  
  getVideoStreamUrl: (storagePath: string): string => {
    return VideoService.getVideoStreamUrl(storagePath);
  }
};
