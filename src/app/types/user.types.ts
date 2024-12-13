// src/types/user.types.ts

export type User = {
    _id: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    bio: string;
    followersCount: number;
    followingCount: number;
    likesCount: number;
    avatar: string;
    username: string;
};
