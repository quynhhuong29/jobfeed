import { Image, PostData } from "@/types/Posts";
import { imageUpload } from "@/utils/imageUpload.util";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createPost, getPosts, likePost, updatePost } from "../apis/postApi";
import { RootState } from "../store";
import { PostState } from "../types/post.type";

const initialState: PostState = {
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
    return response.posts;
  } catch (err: any) {
    console.log(err);
  }
});

export const updatePostAsync = createAsyncThunk(
  "posts/updatePost",
  async ({ _id, content, media, data }: any, { rejectWithValue }) => {
    let images = [];
    const imgNewUrl = media.filter((img: Image) => !img.url);
    const imgOldUrl = media.filter((img: Image) => img.url);

    if (
      data.content === content &&
      imgNewUrl.length === 0 &&
      imgOldUrl.length === data.images.length
    )
      return;

    try {
      if (imgNewUrl.length > 0) images = await imageUpload(imgNewUrl);

      const response = await updatePost(_id, content, [
        ...imgOldUrl,
        ...images,
      ]);
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
  reducers: {
    updatePostAction(state, action) {
      const updatedPosts: PostData[] = state.posts.map((post: PostData) =>
        post._id === action.payload._id ? action.payload : post
      );
      state.posts = updatedPosts;
    },
  },
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
      .addCase(updatePostAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = "";
      })
      .addCase(updatePostAsync.rejected, (state, action: any) => {
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

export const { updatePostAction } = postSlice.actions;
export default postSlice.reducer;
