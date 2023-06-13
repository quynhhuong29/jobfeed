import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

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
  async ({ content, images, socket }: any, { rejectWithValue }: any) => {
    try {
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
  extraReducers: (builder) => {},
});

export default commentSlice.reducer;
