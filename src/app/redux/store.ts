// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// Tạo store Redux và kết nối reducer
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});