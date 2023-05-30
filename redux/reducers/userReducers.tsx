import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserInfoById, searchUser } from "../apis/userAPI";
import { RootState } from "../store";

const initialState: any = {
  search: {
    data: [],
    isLoading: false,
    err: "",
  },
  userInfo: {
    data: [],
    isLoading: false,
    err: "",
  },
};

export const searchUserAsync = createAsyncThunk(
  "user/search",
  async (value: string, { rejectWithValue }: any) => {
    try {
      const response = await searchUser(value);
      return response?.users;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserInfoByIdAsync = createAsyncThunk(
  "user/userInfoById",
  async (id: string, { rejectWithValue }: any) => {
    try {
      const response = await getUserInfoById(id);
      return response?.user;
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchUserAsync.pending, (state) => {
        state.search.err = "";
        state.search.isLoading = true;
      })
      .addCase(searchUserAsync.fulfilled, (state, action) => {
        state.search.isLoading = false;

        state.search.data = action.payload;
        state.search.err = "";
      })
      .addCase(searchUserAsync.rejected, (state, action: any) => {
        state.search.isLoading = false;
        state.search.data = initialState.search.data;

        state.search.err = action.payload?.message ?? "";
      })
      .addCase(getUserInfoByIdAsync.pending, (state) => {
        state.userInfo.err = "";
        state.userInfo.isLoading = true;
      })
      .addCase(getUserInfoByIdAsync.fulfilled, (state, action) => {
        state.userInfo.isLoading = false;

        state.userInfo.data = action.payload;
        state.userInfo.err = "";
      })
      .addCase(getUserInfoByIdAsync.rejected, (state, action: any) => {
        state.userInfo.isLoading = false;
        state.userInfo.data = initialState.userInfo.data;

        state.userInfo.err = action.payload?.message ?? "";
      });
  },
});

export const selectSearchUser = (state: RootState) => state.user.search;
export const selectUserInfo = (state: RootState) => state.user.userInfo;

export default userSlice.reducer;
