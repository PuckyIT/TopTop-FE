// types/video.types.ts
import { User } from "./user.types";

export type VideoType = {
    videoId: string;
    videoUrl: string;
    title: string;
    desc: string;
    poster: string;
    user: User;
    likes: number;
    views: number;
    createdAt: string;
};

export type VideoResponse = {
    videos: VideoType[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalVideos: number;
        hasMore: boolean;
    };
};

// Cập nhật props của ShortVideo để sử dụng VideoType
export type ShortVideoProps = VideoType & {
    autoPlay: boolean;
};