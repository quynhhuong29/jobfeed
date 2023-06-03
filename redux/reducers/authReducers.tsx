import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../apis/authAPI";
import { AuthState } from "../types/auth.type";
import { RootState } from "../store";
import { getItem } from "@/utils/localStorage.util";

const initialState: AuthState = {
  isLoggedIn: getItem("isAuthenticated") === "true",
  data: {
    access_token: "",
    user: null,
  },
  isLoading: false,
  err: "",
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }: any, { rejectWithValue }) => {
    try {
      const response = await login(email, password);
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async ({}, { rejectWithValue }: any) => {
    try {
      const response = await logout();
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.err = "";
        state.isLoading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;

        state.data = action.payload;
        state.err = "";
      })
      .addCase(loginAsync.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.data = initialState.data;

        state.err = action.payload?.message ?? "";
      })
      .addCase(logoutAsync.pending, (state) => {
        state.err = "";
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state = initialState;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false;

        state.err = "Something went wrong. Please try again.";
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUsername = (state: RootState) =>
  state.auth.data.user?.username;

export default authSlice.reducer;
