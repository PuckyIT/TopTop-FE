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
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react'

import toast from "react-hot-toast";
import { ShortVideoProps } from "@/app/types/video.types";
import Image from "next/image";
import { useVideoView } from "@/hooks/useVideoView";

const ShortVideo: React.FC<ShortVideoProps> = ({
  videoUrl,
  poster,
  title,
  desc,
  user,
  likes,
  views,
  videoId,
  createdAt,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [showPlayPauseButton, setShowPlayPauseButton] = useState(false);

  const { handleTimeUpdate: handleViewCount } = useVideoView({
    videoId: videoId, // Assuming user._id is the video ID
    viewThreshold: 0.8,
  });

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

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }

    // Hiển thị nút Play/Pause và đặt timer để ẩn nó
    setShowPlayPauseButton(true);
    setTimeout(() => setShowPlayPauseButton(false), 1000);
  };

  return (
    <div className="relative h-5/6 mt-20 flex flex-row overflow-hidden w-screen justify-center right-40">
      <div
        className="relative max-w-lg overflow-hidden rounded-2xl"
        onClick={handlePlayPause}
        onMouseEnter={() => setShowVolumeControl(true)} // Hiện Volume Control khi hover vào video
        onMouseLeave={() => {
          setShowVolumeControl(false); // Ẩn Volume Control khi rời video
          setShowSlider(false); // Ẩn Slider khi rời khỏi
        }}
      >
        {/* Video Player */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
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
          <h3 className="text-lg font-bold">{user.username}<p className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</p></h3>

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
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="relative -right-3 bottom-0 flex flex-col items-center space-y-6 top-60">
        <div className="flex flex-col items-center w-12 h-12 rounded-full overflow-hidden cursor-pointer">
          <Image
            src={user.avatar}
            alt={user.username}
            width={48}
            height={48}
            className="object-cover"
          />
          <p className="absolute flex items-center justify-center top-9 w-6 h-6 text-white bg-red-500 text-lg rounded-full">+</p>
        </div>

        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-300/20 dark:bg-gray-400/20 rounded-full">
            <FontAwesomeIcon icon={faHeart} className="text-2xl text-foreground" />
          </div>
          <span className="text-xs font-bold text-foreground">{likes}</span>
        </button>

        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-300/20 dark:bg-gray-400/20 rounded-full">
            <FontAwesomeIcon icon={faEye} className="text-2xl text-foreground" />
          </div>
          <span className="text-xs font-bold text-foreground">{views}</span>
        </button>

        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-300/20 dark:bg-gray-400/20 rounded-full">
            <Bookmark className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-xs font-bold text-foreground">125</span>
        </button>

        <button className="flex flex-col items-center space-y-1">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-300/20 dark:bg-gray-400/20 rounded-full">
            <Share2 className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-xs font-bold text-foreground">120</span>
        </button>
      </div>
    </div>
  );
};

export default ShortVideo;
