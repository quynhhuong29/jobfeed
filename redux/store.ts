import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducers from "./reducers/authReducers";
import commentReducers from "./reducers/commentReducers";
import postReducers from "./reducers/postReducers";
import userReducers from "./reducers/userReducers";

const reducer = combineReducers({
  auth: authReducers,
  user: userReducers,
  post: postReducers,
  comment: commentReducers,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
