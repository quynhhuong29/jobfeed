import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CallState = {
  call: any;
};

const initialState: CallState = {
  call: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCall: (state, action) => {
      state.call = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const selectCall = (state: RootState) => state.call.call;

export const { setCall } = callSlice.actions;
export default callSlice.reducer;
