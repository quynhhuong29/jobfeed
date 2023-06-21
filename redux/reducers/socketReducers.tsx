import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const selectSocket = (state: RootState) => state.socket;

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
