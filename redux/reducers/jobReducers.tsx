import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createJob,
  getInfoJob,
  getJobsByCompany,
  updateJob,
} from "../apis/jobApi";
import { RootState } from "../store";
import { JobState } from "../types/job.type";

const initialState: JobState = {
  infoJob: {
    address: "",
    benefit: "",
    company_info: "",
    contact_address: "",
    contact_email: "",
    contact_name: "",
    contact_phone: "",
    createdAt: "",
    employment_type: "",
    expiring_date: "",
    idUser: "",
    image: [],
    industry: {
      _id: "",
      title: "",
      description: "",
    },
    job_description: "",
    job_requirement: "",
    job_title: "",
    level: "",
    salary: { money_type: "", min: "", max: "" },
    updatedAt: "",
    working_experience: { isRequired: false, from: "", to: "" },
    from: "",
    isRequired: false,
    to: "",
    working_location: "",
    _id: "",
  },
  listJobCompany: [],
  error: "",
  isLoading: false,
};

export const createJobAsync = createAsyncThunk(
  "job/createJob",
  async (
    {
      job_title,
      job_description,
      job_requirement,
      industry,
      working_location,
      address,
      employment_type,
      expiring_date,
      benefit,
      experience,
      level,
      image,
      logo,
      salary,
      contact_name,
      contact_address,
      contact_email,
      contact_phone,
      company_id,
      idUser,
    }: any,
    { rejectWithValue }
  ) => {
    try {
      const response = await createJob({
        job_title,
        job_description,
        job_requirement,
        industry,
        working_location,
        address,
        employment_type,
        expiring_date,
        benefit,
        experience,
        level,
        image,
        logo,
        salary,
        contact_name,
        contact_address,
        contact_email,
        contact_phone,
        company_id,
        idUser,
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

export const getInfoJobAsync = createAsyncThunk(
  "job/getInfoJob",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getInfoJob(id);
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getJobsByCompanyAsync = createAsyncThunk(
  "job/getJobsByCompany",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getJobsByCompany(id);
      return response;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateJobAsync = createAsyncThunk(
  "job/updateJob",
  async (
    {
      id,
      benefit,
      job_description,
      job_requirement,
      job_title,
      expiring_date,
      contact_name,
      contact_phone,
      contact_address,
      contact_email,
      experience,
      industry,
      working_location,
      address,
      employment_type,
      level,
      salary,
    }: any,
    { rejectWithValue }
  ) => {
    try {
      const response = await updateJob({
        id,
        benefit,
        job_description,
        job_requirement,
        job_title,
        expiring_date,
        contact_name,
        contact_phone,
        contact_address,
        contact_email,
        experience,
        industry,
        working_location,
        address,
        employment_type,
        level,
        salary,
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

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    // updateJobAction (state, action) {
    //   state.listJobCompany
    // }
  },
  extraReducers: (build) => {
    build
      .addCase(createJobAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(createJobAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = "";
      })
      .addCase(createJobAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      })
      .addCase(getInfoJobAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(getInfoJobAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.infoJob = action.payload;
        state.error = "";
      })
      .addCase(getInfoJobAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      })
      .addCase(getJobsByCompanyAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(getJobsByCompanyAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.listJobCompany = action.payload;
        state.error = "";
      })
      .addCase(getJobsByCompanyAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      })
      .addCase(updateJobAsync.pending, (state) => {
        state.error = "";
        state.isLoading = true;
      })
      .addCase(updateJobAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        state.error = "";
      })
      .addCase(updateJobAsync.rejected, (state, action: any) => {
        state.isLoading = false;

        state.error = action.payload?.message ?? "";
      });
  },
});

export const selectJob = (state: RootState) => state.job;

export default jobSlice.reducer;
