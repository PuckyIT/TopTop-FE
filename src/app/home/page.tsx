"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { AbilityProvider } from "../context/AbilityProvider";
import axiosInstance from "@/untils/axiosInstance";
import ShortVideo from "@/components/ShortVideo";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { VideoType, VideoResponse } from "../types/video.types";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userData = JSON.parse(localStorage.getItem("user") as string);

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
      const response = await axiosInstance.get<VideoResponse>(`videos/all`);
      return response.data.videos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  };

  async function following() {
    try {
      const response = await axiosInstance.get(`/users/${userData.id}/following`);
      localStorage.setItem("following", JSON.stringify(response.data.following.map((user: any) => user._id)));
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  }

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
    following();
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
        className={`min-h-screen theme-transition transition ease-in-out duration-300 
        ${theme === "dark"
            ? "bg-black"
            : "bg-white"
          }`}
      >
        <div
          ref={videoContainerRef}
          className={`h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide theme-transition 
            transition ease-in-out duration-300 
            ${theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-neutral-800"
            }`}
        >
          {error ? (
            <div className="h-screen flex justify-center items-center text-red-500 text-center px-4">
              <p>{error}</p>
            </div>
          ) : videos.length > 0 ? (
            videos.map((video, index) => (
              <div
                key={index}
                className="h-screen flex justify-center items-center snap-start"
              >
                <ShortVideo
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
                  userId={video.userId}
                  autoPlay={index === currentVideoIndex}
                />
              </div>
            ))
          ) : (
            <div className="h-screen flex justify-center items-center text-center px-4">
              <div>
                <p className="mb-2">No videos available.</p>
                <p>Please check back later or try refreshing the page.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AbilityProvider>
  );
};

export default HomePage;
