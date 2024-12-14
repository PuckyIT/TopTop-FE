"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { AbilityProvider } from "../context/AbilityProvider";
import axiosInstance from "@/untils/axiosInstance";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { VideoType, VideoResponse } from "../types/video.types";
import ShortVideoMobile from "@/components/mobile/ShortVideo-Mobile";
import MobileHeader from "@/components/mobile/Header-Mobile";
import MobileFooter from "@/components/mobile/Footer-Mobile";

const HomePageMobile: React.FC = () => {
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleScroll = () => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      const scrollPosition = videoContainer.scrollTop;
      const containerHeight = videoContainer.clientHeight;
      const newIndex = Math.round(scrollPosition / containerHeight);

      if (newIndex !== currentVideoIndex) {
        setCurrentVideoIndex(newIndex);
      }
    }
  };

  const fetchUserVideos = async () => {
    try {
      const response = await axiosInstance.get<VideoResponse>(`users/all`);
      return response.data.videos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const userVideos = await fetchUserVideos();
        setVideos(userVideos);
        setError(null);
      } catch (error: any) {
        setError(
          error.message || "Failed to load videos. Please try again later."
        );
        toast.error("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (videoContainer) {
        videoContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentVideoIndex]);

  return (
    <AbilityProvider role="user">
      <Spinner visible={loading} />
      <div
        className={`relative h-screen w-screen theme-transition transition ease-in-out duration-300 z-50
        ${theme === "dark"
            ? "bg-black"
            : "bg-white"
          }`}
      >
        <MobileHeader />
        <div
          ref={videoContainerRef}
          className={`min-h-screen h-screen w-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide theme-transition 
            transition ease-in-out duration-300 pt-0
            ${theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-neutral-800"
            }`}
        >
          {error ? (
            <div className="h-full w-full flex justify-center items-center text-red-500 text-center px-4">
              <p>{error}</p>
            </div>
          ) : videos.length > 0 ? (
            videos.map((video, index) => (
              <div
                key={index}
                className="h-full w-full flex justify-center items-center snap-start"
              >
                <ShortVideoMobile
                  id={video.id}
                  videoUrl={video.videoUrl}
                  title={video.title}
                  desc={video.desc}
                  commentCount={video.commentCount}
                  likes={video.likes}
                  views={video.views}
                  isPublic={video.isPublic}
                  saved={video.saved}
                  shared={video.shared}
                  createdAt={video.createdAt}
                  likedBy={video.likedBy}
                  savedBy={video.savedBy}
                  user={video.user}
                  autoPlay={index === currentVideoIndex}
                />
              </div>
            ))
          ) : (
            <div className="h-full flex justify-center items-center text-center px-4">
              <div>
                <p className="mb-2">No videos available.</p>
                <p>Please check back later or try refreshing the page.</p>
              </div>
            </div>
          )}
        </div>
        <MobileFooter />
      </div>
    </AbilityProvider>
  );
};

export default HomePageMobile;