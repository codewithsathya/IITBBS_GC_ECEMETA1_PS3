import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    authenticate: (state, action) => {},
    logout: (state) => {},
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
