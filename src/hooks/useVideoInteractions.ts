import { useState } from 'react';
import axiosInstance from '@/untils/axiosInstance';
import toast from 'react-hot-toast';

interface UseVideoInteractionsProps {
  id: string;
  initialLikes: number;
  initialSaved: number;
  initialShared: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const useVideoInteractions = ({
  id,
  initialLikes,
  initialSaved,
  initialShared,
  isLiked = false,
  isSaved = false,
}: UseVideoInteractionsProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(initialSaved);
  const [shared, setShared] = useState(initialShared);
  const [isVideoLiked, setIsVideoLiked] = useState(isLiked);
  const [isVideoSaved, setIsVideoSaved] = useState(isSaved);

  const handleLike = async () => {
    try {
      if (isVideoLiked) {
        await axiosInstance.delete(`/videos/${id}/like`);
        setLikes(prev => prev - 1);
      } else {
        await axiosInstance.post(`/videos/${id}/like`);
        setLikes(prev => prev + 1);
      }
      setIsVideoLiked(!isVideoLiked);
    } catch (error) {
      toast.error('Please login to like videos');
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isVideoSaved) {
        await axiosInstance.delete(`/videos/${id}/save`);
        setSaved(prev => prev - 1);
      } else {
        await axiosInstance.post(`/videos/${id}/save`);
        setSaved(prev => prev + 1);
      }
      setIsVideoSaved(!isVideoSaved);
    } catch (error) {
      toast.error('Please login to save videos');
      console.error('Error toggling save:', error);
    }
  };

  const handleShare = async () => {
    try {
      await axiosInstance.post(`/videos/${id}/share`);
      setShared(prev => prev + 1);
      toast.success('Video shared successfully!');
    } catch (error) {
      toast.error('Error sharing video');
      console.error('Error sharing video:', error);
    }
  };

  const handleComment = async (content: string) => {
    try {
      await axiosInstance.post(`/videos/${id}/comment`, {
        content
      });
      toast.success('Comment added successfully!');
      return true;
    } catch (error) {
      toast.error('Please login to comment');
      console.error('Error adding comment:', error);
      return false;
    }
  };

  return {
    likes,
    saved,
    shared,
    isVideoLiked,
    isVideoSaved,
    handleLike,
    handleSave,
    handleShare,
    handleComment
  };
};