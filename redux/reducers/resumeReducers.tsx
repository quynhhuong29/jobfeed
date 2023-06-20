import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getListResumes } from "../apis/resumeAPI";
import { getListCVByJob } from "../apis/submitCvAPI";
import { RootState } from "../store";

const initialState = {
  data: [],
  listCVOfJob: [],
  isLoading: false,
  error: "",
};

export const getListResumesAsync = createAsyncThunk(
  "resumes/getListResumes",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await getListResumes();
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getListCVByJobAsync = createAsyncThunk(
  "resumes/getListCVByJob",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getListCVByJob(id);
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const resumeSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getListResumesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getListResumesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.data = action.payload;
      })
      .addCase(getListResumesAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      })
      .addCase(getListCVByJobAsync.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getListCVByJobAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.listCVOfJob = action.payload;
      })
      .addCase(getListCVByJobAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});

export const selectResumes = (state: RootState) => state.resumes;

export default resumeSlice.reducer;
