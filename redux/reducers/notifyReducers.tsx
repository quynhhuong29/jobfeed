import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNotifies, removeNotify } from "../apis/notifyAPI";
import { RootState } from "../store";

type NotifyState = {
  loading: boolean;
  data: any;
  sound: boolean;
};

const initialState: NotifyState = {
  loading: false,
  data: [], // Initialize data as an empty array
  sound: false,
};

export const getNotifiesAsync = createAsyncThunk(
  "notify/getNotifies",
  async () => {
    try {
      const res = await getNotifies();
      let arr: any[] = [];
      res.notifies.map((element: any, index: number) => {
        arr[index] = {
          ...element,
          fullName: element.user.firstName + " " + element.user.lastName,
        };
      });
      return arr;
    } catch (err: any) {
      console.log(err);
    }
  }
);

export const removeNotifyAsync = createAsyncThunk(
  "notify/remove",
  async ({ msg, socket }: any) => {
    try {
      await removeNotify(msg?.id, msg?.url);
      socket?.emit("removeNotify", msg);
    } catch (err) {
      console.log(err);
    }
  }
);

const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    createNotifyAction(state, action) {
      if (Array.isArray(state.data)) {
        state.data.push(action.payload);
      } else {
        state.data = [action.payload];
      }
    },
    deleteAllNotifiesAction(state) {
      state.data = [];
    },
    isReadNotifyAction(state, action) {
      state.data?.notifies?.forEach((ele: any) => {
        console.log(action.payload);
        if (ele?._id === action.payload) {
          ele.isRead = true;
        }
      });
    },
    removeNotifyAction(state, action) {
      state.data = state.data.filter(
        (item: any) =>
          item.id !== action.payload.id || item.url !== action.payload.url
      );
    },
    updateSoundAction(state, action) {
      state.sound = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getNotifiesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifiesAsync.fulfilled, (state, action) => {
        (state.data = action.payload), (state.loading = false);
      })
      .addCase(getNotifiesAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectNotify = (root: RootState) => root.notify;

export const {
  createNotifyAction,
  deleteAllNotifiesAction,
  isReadNotifyAction,
  removeNotifyAction,
  updateSoundAction,
} = notifySlice.actions;

export default notifySlice.reducer;
