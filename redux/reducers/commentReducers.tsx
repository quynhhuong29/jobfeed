import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createComment } from "../apis/commentAPI";
import { RootState, useAppDispatch } from "../store";
import { updatePostAction, updatePostAsync } from "./postReducers";

const initialState = {
  comments: {
    isLoading: false,
    error: "",
    data: [],
  },
  newComment: {
    isLoading: false,
    error: "",
    data: [],
  },
};

export const createCommentAsync = createAsyncThunk(
  "comments/create",
  async ({ newComment, post, socket }: any, { rejectWithValue }: any) => {
    try {
      const data = {
        ...newComment,
        postId: post._id,
        postUserId: post.user._id,
      };
      const response = await createComment(data);

      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCommentAsync.pending, (state) => {
        state.newComment.isLoading = true;

        state.newComment.error = "";
      })
      .addCase(createCommentAsync.fulfilled, (state, action) => {
        state.newComment.isLoading = false;

        state.newComment.error = "";
        state.newComment.data = action.payload;
      })
      .addCase(createCommentAsync.rejected, (state, action: any) => {
        state.newComment.isLoading = false;

        state.newComment.error = action.payload?.message ?? "";
      });
  },
});

export const selectLoadingNewComment = (state: RootState) => state.comment.newComment.isLoading;

export default commentSlice.reducer;
