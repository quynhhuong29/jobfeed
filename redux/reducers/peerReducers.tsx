import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type PeerState = {
  peer: any;
};

const initialState: PeerState = {
  peer: null,
};

const peerSlice = createSlice({
  name: "peer",
  initialState,
  reducers: {
    setPeer: (state, action) => {
      state.peer = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const selectPeer = (state: RootState) => state.peer.peer;

export const { setPeer } = peerSlice.actions;
export default peerSlice.reducer;
