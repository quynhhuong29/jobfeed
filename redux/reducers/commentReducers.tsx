import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createComment, updateComment } from "../apis/commentAPI";
import { RootState, useAppDispatch } from "../store";
import { updatePostAction, updatePostAsync } from "./postReducers";

type CommentState = {
  comments: {
    isLoading: boolean;
    error: string;
    data: any[];
  };
  newComment: {
    isLoading: boolean;
    error: string;
    data: any[];
  };
  isLoading: boolean;
  error: string;
};

const initialState: CommentState = {
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
  isLoading: false,
  error: "",
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

export const updateCommentAsync = createAsyncThunk(
  "comments/update",
  async ({ _id, content }: any, { rejectWithValue }: any) => {
    try {
      const response = await updateComment({
        _id,
        content,
      });

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
  reducers: {
    updateCommentAction(state, action) {
      const comments: any[] = state.comments?.data.map((comment: any) =>
        comment._id === action.payload._id ? action.payload : comment
      );
      state.comments.data = comments;
    },
  },
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
      })
      .addCase(updateCommentAsync.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(updateCommentAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(updateCommentAsync.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? "";
      });
  },
});

export const selectLoading = (state: RootState) => {
  state.comment.isLoading;
};
export const selectLoadingNewComment = (state: RootState) =>
  state.comment.newComment.isLoading;

export const { updateCommentAction } = commentSlice.actions;
export default commentSlice.reducer;
