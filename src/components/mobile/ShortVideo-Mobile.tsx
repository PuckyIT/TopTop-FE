"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faUpLong,
  faHeart,
  faComment,
  faBookmark,
  faShare
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";
import { VideoType } from "@/app/types/video.types";
import Image from "next/image";
import { useVideoView } from "@/hooks/useVideoView";
import axiosInstance from "@/untils/axiosInstance";
import { useTheme } from "@/app/context/ThemeContext";
import LoginNotificationModal from "../modal/LoginNotificationModal";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/redux/userSlice";

const ShortVideoMobile: React.FC<VideoType> = ({
  id,
  videoUrl,
  title,
  desc,
  likes: initialLikes,
  commentCount,
  saved: initialSaved,
  shared: initialShared,
  createdAt,
  likedBy = [],
  savedBy = [],
  userId,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayPauseButton, setShowPlayPauseButton] = useState(false);
  const [likes, setLikes] = useState(Number(initialLikes));
  const [saved, setSaved] = useState(Number(initialSaved));
  const [shared, setShared] = useState(Number(initialShared));
  const [isVideoLiked, setIsVideoLiked] = useState(false);
  const [isVideoSaved, setIsVideoSaved] = useState(false);
  const { theme } = useTheme()
  const { handleTimeUpdate: handleViewCount } = useVideoView({
    videoId: id,
    viewThreshold: 0.8,
  });
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTriggered, setModalTriggered] = useState(false);
  const following = localStorage.getItem("following");

  // Update video metadata and currentTime
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video) {
      video.addEventListener("loadedmetadata", () => {
        setDuration(video.duration);
      });

      const handleTimeUpdate = () => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          setCurrentTime(currentTime);
          handleViewCount(currentTime, videoRef.current.duration);
        }
      };
      video.addEventListener("timeupdate", handleTimeUpdate);

      const handlePlay = () => setShowPlayPauseButton(false);
      const handlePause = () => setShowPlayPauseButton(true);

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);

      return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [autoPlay]);

  const handleSeek = (value: number | number[]) => {
    const seekValue = Array.isArray(value) ? value[0] : value;
    if (videoRef.current) {
      videoRef.current.currentTime = seekValue;
      setCurrentTime(seekValue);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }

    setShowPlayPauseButton(true);
    setTimeout(() => setShowPlayPauseButton(false), 1000);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") as string);
    if (userData) {
      try {
        setIsVideoLiked(likedBy.includes(userData.id));
        setIsVideoSaved(savedBy.includes(userData.id));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/users/${userId._id}/follow`);
      toast.success('Followed successfully!');
      const updatedFollowing = [...user.following, userId._id];
      dispatch(setUser({ ...user, following: updatedFollowing }));
    } catch (error) {
      toast.error('Error following user');
      console.error('Error following user:', error);
    }
  };

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
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setIsVideoLiked(true);
        toast.error(error.response.data.message);
        return;
      }
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
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setIsVideoSaved(true);
        toast.error(error.response.data.message);
        return;
      }
      toast.error('Please login to save videos');
      console.error('Error toggling save:', error);
    }
  };

  const handleShare = async () => {
    try {
      await axiosInstance.post(`/videos/${id}/share`);
      setShared(prev => prev + 1);
      toast.success('Video shared successfully!');
    } catch (error: any) {
      if (error.response.status === 403) {
        toast.error(error.response.data.message);
        return;
      }
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

  const openLoginModal = () => {
    setIsModalOpen(true);
    setModalTriggered(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
    setModalTriggered(false);
  };

  return (
    <div className="relative w-screen h-screen max-h-[90vh] -top-8 flex flex-row overflow-hidden justify-center 
    bg-transparent transition ease-in-out duration-300 z-30">
      <div
        className="relative max-w-screen h-full overflow-hidden"
        onClick={handlePlayPause}
      >
        {/* Video Player */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-w-lg h-full object-cover"
          loop
          playsInline
          onClick={handlePlayPause}
          onError={() => {
            console.error("Failed to load video:", videoUrl);
            toast.error("Cannot load video");
          }}
        />
        {/* Video Info */}
        <div className="absolute left-3 bottom-5 w-full max-w-64 text-white text-opacity-90">
          <h3 className="text-lg font-bold">{userId.username}<p className="text-xs text-neutral-400">{new Date(createdAt).toLocaleString()}</p></h3>

          {/* Video Title */}
          <p className="mt-2 text-base">{title}</p>
          <p className="text-sm">{desc}</p>
        </div>

        {/* Play/Pause Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none ${showPlayPauseButton ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
        >
          <button
            onClick={handlePlayPause}
            className="pointer-events-auto text-white text-opacity-90 text-2xl px-4 py-2 bg-black bg-opacity-50 rounded-full"
          >
            <FontAwesomeIcon icon={autoPlay ? faPause : faPlay} />
          </button>
        </div>
      </div>

      {/* Video Controls */}
      <div className="absolute -bottom-[3px] h-3 w-full" onClick={(e) => e.stopPropagation()}>
        <Slider
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          trackStyle={{ backgroundColor: "rgb(255,255,255)", height: 4 }}
          railStyle={{ backgroundColor: "rgba(255,255,255,0.3)", height: 4 }}
          handleStyle={{
            backgroundColor: "rgb(255,255,255)",
            height: 10,
            width: 10,
            border: "none",
            bottom: 3,
            opacity: 1,
            cursor: "pointer",
          }}
        />
      </div>

      {/* Right Sidebar */}
      {user?.isActive ? (
        <div className="absolute right-3 top-4 flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center w-12 h-12 rounded-full overflow-hidden cursor-pointer">
            <Image
              src={userId.avatar}
              alt={'Avatar'}
              width={48}
              height={48}
              className="object-cover h-full w-full"
            />
            {userId._id !== user._id && !following?.includes(userId._id) && (
              <p
                className="absolute flex items-center justify-center top-9 w-6 h-6 text-white bg-rose-500 text-lg rounded-full"
                onClick={handleFollow}
              >
                +
              </p>
            )}
          </div>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={handleLike}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faHeart} className={`${isVideoLiked ? 'text-rose-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{likes}</span>
          </button>

          <button className="flex flex-col items-center space-y-1">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faComment} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{commentCount}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={handleSave}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faBookmark} className={`${isVideoSaved ? 'text-yellow-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{saved}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={handleShare}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faShare} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{shared}</span>
          </button>
        </div>
      ) : (
        <div className="absolute right-3 bottom-4 flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center w-12 h-12 rounded-full overflow-hidden cursor-pointer">
            <Image
              src={userId.avatar}
              alt={'Avatar'}
              width={48}
              height={48}
              className="object-cover h-full w-full"
            />
            <p className="absolute flex items-center justify-center top-9 w-6 h-6 text-white bg-rose-500 text-lg rounded-full">+</p>
          </div>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={() => {
              if (!modalTriggered) openLoginModal();
            }}          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faHeart} className={`${isVideoLiked ? 'text-rose-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{likes}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={() => {
              if (!modalTriggered) openLoginModal();
            }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faComment} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{commentCount}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={() => {
              if (!modalTriggered) openLoginModal();
            }}          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faBookmark} className={`${isVideoSaved ? 'text-yellow-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{saved}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={() => {
              if (!modalTriggered) openLoginModal();
            }}          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
            ${theme === "light" ? "text-neutral-200 bg-neutral-400/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faShare} />
            </div>
            <span className="text-xs font-bold text-foreground text-neutral-50">{shared}</span>
          </button>
        </div>
      )}
      {isModalOpen && (
        <LoginNotificationModal
          isOpen={isModalOpen}
          onClose={closeLoginModal}
        />
      )}
    </div>
  );
};

export default ShortVideoMobile;
