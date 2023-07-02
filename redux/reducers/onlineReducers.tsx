import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { stat } from "fs";

type OnlineState = {
  online: Array<any>;
};

const initialState: OnlineState = {
  online: [],
};

const onlineSlice = createSlice({
  name: "online",
  initialState,
  reducers: {
    setOnline: (state, action) => {
      state.online = action.payload;
    },
    setOffline: (state, action) => {
        if(state.online)
          state.online = state.online?.filter((user) => user._id !== action.payload);
    }
  },
  extraReducers(builder) {},
});

export const selectOnline = (state: RootState) => state.online.online;

export const { setOnline, setOffline } = onlineSlice.actions;
export default onlineSlice.reducer;
