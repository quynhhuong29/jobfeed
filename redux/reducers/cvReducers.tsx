import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCV } from "../apis/cvAPI";
import { RootState } from "../store";

const initialState = {
  data: [],
  isLoading: false,
  error: "",
};

export const createCVAsync = createAsyncThunk(
  "auth/createCV",
  async (
    {
      title,
      firstName,
      lastName,
      phone,
      DOB,
      country,
      language,
      email,
      city,
      address,
      overview,
      workExperience,
      skill,
      education,
      hobbies,
      avatar,
      linkedin,
      tags,
    }: any,
    { rejectWithValue }
  ) => {
    try {
      const response = await createCV({
        title,
        firstName,
        lastName,
        phone,
        DOB,
        country,
        language,
        email,
        city,
        address,
        overview,
        workExperience,
        skill,
        education,
        hobbies,
        avatar,
        linkedin,
        tags,
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

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createCVAsync.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(createCVAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(createCVAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});

export const selectCV = (state: RootState) => state.cv;

export default cvSlice.reducer;
