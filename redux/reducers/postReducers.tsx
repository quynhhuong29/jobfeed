import { imageUpload } from "@/utils/imageUpload.util";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createPost, getPosts } from "../apis/postApi";
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

export const getPostsAsync = createAsyncThunk("posts/getAllPosts", async () => {
  try {
    const response = await getPosts();
    return response;
  } catch (err: any) {
    console.log(err);
  }
});

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
      })
      .addCase(getPostsAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(getPostsAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = "";
        state.posts = action.payload;
      })
      .addCase(getPostsAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});
export const selectLoadingPost = (state: RootState) => state.post.isLoading;
export const selectPosts = (state: RootState) => state.post.posts;

export default postSlice.reducer;
