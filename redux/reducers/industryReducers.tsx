import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllIndustry } from "../apis/industryAPI";
import { RootState } from "../store";

const initialState = {
  data: [],
  error: "",
  isLoading: false,
};

export const getAllIndustryAsync = createAsyncThunk(
  "industry/getAllIndustry",
  async () => {
    try {
      const response = await getAllIndustry();
      return response;
    } catch (err: any) {
      console.log(err);
    }
  }
);

const industrySlice = createSlice({
  name: "industry",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(getAllIndustryAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(getAllIndustryAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = "";
        state.data = action.payload;
      })
      .addCase(getAllIndustryAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});

export const selectIndustry = (state: RootState) => state.industry;

export default industrySlice.reducer;
