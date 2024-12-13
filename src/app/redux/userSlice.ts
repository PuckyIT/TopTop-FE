// redux/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user.types";

// Khởi tạo state ban đầu là null
const initialState = {
  _id: '',
  email: '',
  password: '',
  role: '',
  isActive: false,
  createdAt: '',
  updatedAt: '',
  bio: '',
  followersCount: 0,
  followingCount: 0,
  likesCount: 0,
  avatar: '',
  username: '',
};

// Tạo slice cho người dùng
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
  },
});

// Export các actions từ slice
export const { setUser } = userSlice.actions;

// Export reducer của slice
export default userSlice.reducer;