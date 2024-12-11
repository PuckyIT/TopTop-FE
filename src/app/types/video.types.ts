// types/video.types.ts
import { User } from "./user.types";

export type VideoType = {
    id: string;
    userId: string;
    videoUrl: string;
    title: string;
    desc: string;
    username: string;
    likes: number;
    views: number;
    comments?: any[];
    commentCount: number;
    isPublic: boolean;
    likedBy?: string[];
    saved: number;
    savedBy?: string[];
    shared: number;
    sharedBy?: string[];
    createdAt: string;
    updatedAt?: string;
    avatar: string;
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

// Props for ShortVideo component
export type ShortVideoProps = Omit<VideoType, 'user'> & {
    autoPlay?: boolean;
    user?: User;
};