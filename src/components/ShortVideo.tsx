"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
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
import { useDispatch, useSelector } from "react-redux";
import LoginNotificationModal from "./modal/LoginNotificationModal";
import { setUser } from "@/app/redux/userSlice";

const ShortVideo: React.FC<VideoType> = ({
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
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [showPlayPauseButton, setShowPlayPauseButton] = useState(false);
  const [likes, setLikes] = useState(Number(initialLikes));
  const [saved, setSaved] = useState(Number(initialSaved));
  const [shared, setShared] = useState(Number(initialShared));
  const [isVideoLiked, setIsVideoLiked] = useState(false);
  const [isVideoSaved, setIsVideoSaved] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.user);
  const { theme } = useTheme()

  const { handleTimeUpdate: handleViewCount } = useVideoView({
    videoId: id,
    viewThreshold: 0.8,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTriggered, setModalTriggered] = useState(false);

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

  const handleSeek = (value: number | number[]) => {
    const seekValue = Array.isArray(value) ? value[0] : value;
    if (videoRef.current) {
      videoRef.current.currentTime = seekValue;
      setCurrentTime(seekValue);
    }
  };

  const handleVolumeChange = (value: number | number[]) => {
    const volumeValue = Array.isArray(value) ? value[0] : value;
    if (videoRef.current) {
      const newVolume = volumeValue / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? volume : 0;
      setIsMuted(!isMuted);
    }
  };

  const scrollToNextVideo = () => {
    const nextVideo = document.querySelector(".next-video");
    if (nextVideo) {
      nextVideo.scrollIntoView({ behavior: "smooth" });
    } else {
      toast.error("No next video available!");
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [autoPlay]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }

    // Hiển thị nút Play/Pause và đặt timer để ẩn nó
    setShowPlayPauseButton(true);
    setTimeout(() => setShowPlayPauseButton(false), 1000);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") as string);
    const following = localStorage.getItem("following");
    dispatch(setUser({ ...user, following: following ? JSON.parse(following) : [] }));
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.status === 403) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error('Error sharing video');
      console.error('Error sharing video:', error);
    }
  };

  // const handleComment = async (content: string) => {
  //   try {
  //     await axiosInstance.post(`/videos/${id}/comment`, {
  //       content
  //     });
  //     toast.success('Comment added successfully!');
  //     return true;
  //   } catch (error) {
  //     toast.error('Please login to comment');
  //     console.error('Error adding comment:', error);
  //     return false;
  //   }
  // };

  const openLoginModal = () => {
    setIsModalOpen(true);
    setModalTriggered(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
    setModalTriggered(false);
  };

  return (
    <div className="relative h-5/6 mt-20 flex flex-row overflow-hidden w-screen justify-center right-40 
    bg-transparent transition ease-in-out duration-300">
      <div
        className="relative max-w-lg overflow-hidden rounded-2xl"
        onClick={handlePlayPause}
        onMouseEnter={() => setShowVolumeControl(true)}
        onMouseLeave={() => {
          setShowVolumeControl(false);
          setShowSlider(false);
        }}
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
        {/* Video Controls */}
        <div className="absolute -bottom-0 h-2 w-full bg-gradient-to-t from-black/50 to-transparent rounded-2xl" onClick={(e) => e.stopPropagation()}>
          <Slider
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            trackStyle={{ backgroundColor: "#ff204e", height: 3 }}
            railStyle={{ backgroundColor: "rgba(255,255,255,0.3)", height: 3 }}
            handleStyle={{
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </div>

        {/* Video Info */}
        <div className="absolute left-[4%] bottom-[12%] w-[90%] text-white text-opacity-90">
          <h3 className="text-lg font-bold">{userId.username}<p className="text-xs text-neutral-400">{new Date(createdAt).toLocaleString()}</p></h3>

          {/* Video Title */}
          <p className="mt-2 text-base">{title}</p>
          <p className="text-sm">{desc}</p>
        </div>

        {/* Volume Control */}
        {showVolumeControl && (
          <div
            className={`absolute top-8 flex justify-between w-full px-3 transform z-10 ${showVolumeControl ? "opacity-100 scale-100" : "opacity-0 scale-90"
              } transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center relative"
              onMouseEnter={() => setShowSlider(true)}
              onMouseLeave={() => setShowSlider(false)}
            >
              <FontAwesomeIcon
                icon={isMuted ? faVolumeMute : faVolumeUp}
                onClick={toggleMute}
                className="text-white text-opacity-90 text-xl px-2 cursor-pointer"
              />
              <div
                className={`relative top-0 left-0 transform ${showSlider ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  } transition-all duration-300`}
              >
                {showSlider && (
                  <div className="relative cursor-pointer w-16 ml-2">
                    <Slider
                      min={0}
                      max={100}
                      value={volume * 100}
                      onChange={handleVolumeChange}
                      trackStyle={{ backgroundColor: "white", height: 3 }}
                      railStyle={{ backgroundColor: "gray", height: 3 }}
                      handleStyle={{
                        cursor: "pointer",
                        border: "none",
                        opacity: 1,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faUpLong}
                onClick={scrollToNextVideo}
                className="text-white text-opacity-90 text-xl px-2 cursor-pointer"
              />
            </div>
          </div>
        )}

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

      {/* Right Sidebar */}
      {user?.isActive ? (
        <div className="relative -right-3 bottom-0 flex flex-col items-center space-y-6 top-60">
          <div className="flex flex-col items-center w-12 h-12 rounded-full overflow-hidden cursor-pointer">
            <Image
              src={userId.avatar}
              alt={'Avatar'}
              width={48}
              height={48}
              className="object-cover h-full w-full"
            />
            {userId._id !== user._id && !user.following?.includes(userId._id) && (
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
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faHeart} className={`${isVideoLiked ? 'text-rose-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground">{likes}</span>
          </button>

          <button className="flex flex-col items-center space-y-1">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faComment} />
            </div>
            <span className="text-xs font-bold text-foreground">{commentCount}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={handleSave}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faBookmark} className={`${isVideoSaved ? 'text-yellow-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground">{saved}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={handleShare}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faShare} />
            </div>
            <span className="text-xs font-bold text-foreground">{shared}</span>
          </button>
        </div>
      ) : (
        <div className="relative -right-3 bottom-0 flex flex-col items-center space-y-6 top-60">
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
            }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faHeart} className={`${isVideoLiked ? 'text-rose-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground">{likes}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={() => {
              if (!modalTriggered) openLoginModal();
            }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faComment} />
            </div>
            <span className="text-xs font-bold text-foreground">{commentCount}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={() => {
              if (!modalTriggered) openLoginModal();
            }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faBookmark} className={`${isVideoSaved ? 'text-yellow-500' : ''}`} />
            </div>
            <span className="text-xs font-bold text-foreground">{saved}</span>
          </button>

          <button
            className="flex flex-col items-center space-y-1"
            onClick={() => {
              if (!modalTriggered) openLoginModal();
            }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl text-foreground
              ${theme === "light" ? "text-neutral-900 bg-neutral-300/20" : "text-neutral-200 bg-neutral-400/20"}`}>
              <FontAwesomeIcon icon={faShare} />
            </div>
            <span className="text-xs font-bold text-foreground">{shared}</span>
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

export default ShortVideo;
