import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    authenticate: (state, action) => {
      state.user = action.payload?.data;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
