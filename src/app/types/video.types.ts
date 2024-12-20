// types/video.types.ts

export type VideoType = {
    id: string;
    videoUrl: string;
    title: string;
    desc: string;
    likes: number;
    views: number;
    comments?: any[];
    commentCount: number;
    isPublic: boolean;
    likedBy: string[];
    saved: number;
    savedBy: string[];
    shared: number;
    sharedBy?: string[];
    createdAt: string;
    updatedAt?: string;
    userId: {
        avatar: string;
        _id: string;
        username: string;
    };
    autoPlay?: boolean;
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