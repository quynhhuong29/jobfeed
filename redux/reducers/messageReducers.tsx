import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { DeleteData, EditData } from "@/utils/handleData";
import { getConversationsApi, getMessagesApi, messageApi } from "../apis/messages";

type MessageState = {
    users: Array<any>;
    resultUsers: number;
    data: Array<any>;
    firstLoad: boolean;
};

interface IGetConversations {
    auth: any;
    page?: number;
}

const initialState: MessageState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false
};

export const getMessagesAsync = createAsyncThunk(
    "message/getMessages",
    async ({ id, page }: any, { rejectWithValue }) => {
      try {
        const response = await getMessagesApi(id, page);
        console.log("getMessagesAsync", response)
        const newData = {...response, messages: response.messages.reverse()}
        return {...newData, _id: id, page};
      } catch (err: any) {
        if (!err.response) {
          throw err;
        }
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const getConversationsAsync = createAsyncThunk(
    "message/getConversations",
    async ({ auth, page}: IGetConversations, { rejectWithValue }) => {
      try {
        const data  = page || 1
        const response = await getConversationsApi(data);
        console.log("getConversationsAsync", response)
        let newArr = [] as any;
        response.conversations.forEach((item: any) => {
            item.recipients.forEach((cv:any) => {
                if(cv._id !== auth.user._id){
                    newArr.push({...cv, text: item.text, media: item.media, call: item.call})
                }
            })
        })
        return {newArr, result: response.result, auth};
      } catch (err: any) {
        if (!err.response) {
          throw err;
        }
        return rejectWithValue(err.response);
      }
    }
  );

  export const addMessageAsync = createAsyncThunk(
    "message/addMessage",
    async ({ msg, auth, socket }: any, { rejectWithValue }) => {
      try {
        const response = await messageApi(msg);
        console.log("AddMessageAsync", response)
        return {data: response, auth, socket, msg};
      } catch (err: any) {
        if (!err.response) {
          throw err;
        }
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const loadMoreMessagesAsync = createAsyncThunk(
    "message/updateMessage",
    async ({ id, page }: any, { rejectWithValue }) => {
      try {
        const data  = page || 1
        const response = await getMessagesApi(id, data);
        console.log("loadMoreMessagesAsync", response)
        const newData = {...response.data, messages: response.data.messages.reverse()}
        return {...newData, _id:id };
      } catch (err: any) {
        if (!err.response) {
          throw err;
        }
        return rejectWithValue(err.response.data);
      }
    }
  );

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addUser: (state, action) => {
        console.log("log", state.users)
        if(state.users?.every(item => item._id !== action.payload._id)){
            return {
                ...state,
                users: [action.payload, ...state.users]
            };
        }
        return state;
    },
    addMessage: (state, action) => {
      return {
        ...state,
        data: state.data.map(item => 
            item._id === action.payload.recipient || item._id === action.payload.sender 
            ? {
                ...item,
                messages: [...item.messages, action.payload],
                result: item.result + 1
            }
            : item
        ),
        users: state.users.map(user => 
            user._id === action.payload.recipient || user._id === action.payload.sender
            ? {
                ...user, 
                text: action.payload.text, 
                media: action.payload.media,
                call: action.payload.call
            }
            : user
        )
    };
    },
    getConversations: (state, action) => {
        return {
            ...state,
            users: action.payload.newArr || [],
            resultUsers: action.payload.result || [],
            firstLoad: true
        };
    },
    deleteMessage: (state, action) => {
        return {
            ...state,
            data: state.data.map(item => 
                item._id === action.payload._id
                ? {...item, messages: action.payload.newData}
                : item
            )
        };
    },
    deleteConversation: (state, action) => {
        return {
            ...state,
            users: DeleteData(state.users, action.payload),
            data: DeleteData(state.data, action.payload)
        };
    },
    checkOnlineOffline: (state, action) => {
        return {
            ...state,
            users: state.users && state.users.map(user => 
                action.payload.includes(user._id)
                ? {...user, online: true}
                : {...user, online: false}
            )
        };
    }
  },
  extraReducers(builder) {
    builder
    .addCase(getMessagesAsync.fulfilled, (state, action) => {
        console.log("action", action.payload)
        return {
            ...state,
            data: [...state.data, action.payload]
        };
    })
    .addCase(getMessagesAsync.rejected, (state, action) => {
      console.log("getMessages rejected", action.payload)
      return state
    })
    .addCase(getConversationsAsync.fulfilled, (state, action) => {
        return {
            ...state,
            users: action.payload.newArr,
            resultUsers: action.payload.result,
            firstLoad: true
        };
    })
    .addCase(addMessageAsync.fulfilled, (state, action) => {
        const {msg, auth, socket, data} = action.payload;

        const { _id, avatar, firstName, lastName } = auth.user
        socket.emit('addMessage', {...msg, user: { _id, avatar, firstName, lastName } })
        console.log("state users", state.users)
        return {
            ...state,
            data: state.data.map(item => {
                let messages = [] as any;
                if(item && item.messages)
                    messages = [...item.messages];
                return (item._id === msg.recipient || item._id === msg.sender 
                    ? {
                        ...item,
                        messages: [...messages, msg],
                        result: item.result + 1
                    }
                    : item)
            }),
            users: state.users.map(user => 
                user._id === msg.recipient || user._id === msg.sender
                ? {
                    ...user, 
                    text: msg.text, 
                    media: msg.media,
                    call: msg.call
                }
                : user
            )
        };
    })
    .addCase(loadMoreMessagesAsync.fulfilled, (state, action) => {
      return {
        ...state,
        data: EditData(state.data, action.payload._id, action.payload)
    }
    })
  },
});

export const selectMessage = (state: RootState) => state.message;

export const { addUser, deleteMessage, deleteConversation, checkOnlineOffline, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
