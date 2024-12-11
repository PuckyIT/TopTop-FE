// redux/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user.types";

// Khởi tạo state ban đầu là null
const initialState = {
  id: '',
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
  name: "user",
  initialState,
  reducers: {
    // Cập nhật thông tin người dùng
    setUser(state, action: PayloadAction<User>) {
      if (state) {
        Object.assign(state, action.payload); // Cập nhật trực tiếp state
      } else {
        return action.payload; // Thiết lập state mới khi state hiện tại là null
      }
    },
    // Xóa thông tin người dùng
    clearUser() {
      return {
        id: '',
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
      }; // Xóa người dùng
    },
  },
});

// Export các actions từ slice
export const { setUser, clearUser } = userSlice.actions;

// Export reducer của slice
export default userSlice.reducer;