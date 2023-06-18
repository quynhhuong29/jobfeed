import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getInfoCompany } from "../apis/companyAPI";
import { RootState } from "../store";
import { CompanyState } from "../types/company.type";

const initialState: CompanyState = {
  infoCompany: [],
  error: "",
  isLoading: false,
};

export const getInfoCompanyAsync = createAsyncThunk(
  "company/infoCompany",
  async (id: string) => {
    try {
      const response = await getInfoCompany(id);
      return response[0];
    } catch (err: any) {
      console.log(err);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(getInfoCompanyAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(getInfoCompanyAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = "";
        state.infoCompany = action.payload;
      })
      .addCase(getInfoCompanyAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});

export const selectCompany = (state: RootState) => state.company;

export default companySlice.reducer;
