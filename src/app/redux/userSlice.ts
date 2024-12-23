import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user.types";

const initialState: Partial<User> = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<User>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
