import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllPosts, getAllUser } from "../apis/adminAPI";
import { RootState } from "../store";
import { AdminState } from "../types/admin.type";

const initialState: AdminState = {
  users: {
    data: [],
    isLoading: false,
    error: "",
  },
  posts: {
    data: [],
    isLoading: false,
    error: "",
  },
};

export const getAllUserAsync = createAsyncThunk(
  "admin/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUser();
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllPostsAsync = createAsyncThunk(
  "admin/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPosts();
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllUserAsync.pending, (state) => {
        state.users.isLoading = true;
        state.users.error = "";
      })
      .addCase(getAllUserAsync.fulfilled, (state, action) => {
        state.users.isLoading = false;
        state.users.error = "";
        state.users.data = action.payload?.users ? action.payload.users : [];
      })
      .addCase(getAllUserAsync.rejected, (state, action: any) => {
        state.users.isLoading = false;
        state.users.error = action.payload?.message ?? "";
      })
      .addCase(getAllPostsAsync.pending, (state) => {
        state.posts.isLoading = true;
        state.posts.error = "";
      })
      .addCase(getAllPostsAsync.fulfilled, (state, action) => {
        state.posts.isLoading = false;
        state.posts.error = "";
        state.posts.data = action.payload?.posts ? action.payload.posts : [];
      })
      .addCase(getAllPostsAsync.rejected, (state, action: any) => {
        state.posts.isLoading = false;
        state.posts.error = action.payload?.message ?? "";
      });
  },
});

export const selectUsersAdmin = (state: RootState) => state.admin.users;
export const selectPostsAdmin = (state: RootState) => state.admin.posts;

export default adminSlice.reducer;
