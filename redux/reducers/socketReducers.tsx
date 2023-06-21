import { createSlice } from "@reduxjs/toolkit";
import { initial } from "lodash";
import { RootState } from "../store";

type SocketState = {
  socket: any;
};

const initialState: SocketState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const selectSocket = (state: RootState) => state.socket.socket;

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
