import { useRef, useEffect } from 'react';
import axios from 'axios';

interface UseVideoViewProps {
  videoId: string;
  viewThreshold?: number;
}

export const useVideoView = ({ videoId, viewThreshold = 0.8 }: UseVideoViewProps) => {
  const viewCountedRef = useRef<boolean>(false);

  const handleTimeUpdate = async (currentTime: number, duration: number) => {
    if (!duration || viewCountedRef.current) return;

    // Check if user has watched enough of the video (default 80%)
    if (currentTime / duration >= viewThreshold) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/videos/${videoId}/view`);
        viewCountedRef.current = true;
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    }
  };

  useEffect(() => {
    // Reset viewCounted when videoId changes
    viewCountedRef.current = false;
  }, [videoId]);

  return { handleTimeUpdate };
};
