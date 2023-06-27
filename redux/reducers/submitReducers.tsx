import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSubmitted } from "../apis/submitCvAPI";
import { RootState } from "../store";

const initialState = {
  data: [],
  loading: false,
  error: "",
};

export const getSubmittedAsync = createAsyncThunk(
  "submit/getSubmitted",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubmitted();
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const submitSlice = createSlice({
  name: "submit",
  initialState,
  reducers: {
    updateSubmittedAction(state, action) {
      state.data = state.data.filter(
        (ele: any) => ele.jobInfo._id !== action.payload
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSubmittedAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getSubmittedAsync.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(getSubmittedAsync.rejected, (state, action: any) => {
        state.loading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});

export const { updateSubmittedAction } = submitSlice.actions;
export const selectSubmitted = (root: RootState) => root.submit;
export default submitSlice.reducer;
