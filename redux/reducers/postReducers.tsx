import { imageUpload } from "@/utils/imageUpload.util";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createPost } from "../apis/postApi";
import { RootState } from "../store";

const initialState = {
  posts: [],
  isLoading: false,
  error: "",
};

export const createPostAsync = createAsyncThunk(
  "posts/create",
  async ({ content, images, socket }: any, { rejectWithValue }: any) => {
    let media = [];
    try {
      if (images.length > 0) media = await imageUpload(images);

      const response = await createPost(content, media);
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = "";
      })
      .addCase(createPostAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});
export const selectLoadingPost = (state: RootState) => state.post.isLoading;
export const selectPosts = (state: RootState) => state.post.posts;

export default postSlice.reducer;
