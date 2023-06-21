import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducers from "./reducers/authReducers";
import commentReducers from "./reducers/commentReducers";
import companyReducers from "./reducers/companyReducers";
import cvReducers from "./reducers/cvReducers";
import industryReducers from "./reducers/industryReducers";
import jobReducers from "./reducers/jobReducers";
import postReducers from "./reducers/postReducers";
import resumeReducers from "./reducers/resumeReducers";
import socketReducers from "./reducers/socketReducers";
import userReducers from "./reducers/userReducers";

const reducer = combineReducers({
  auth: authReducers,
  user: userReducers,
  post: postReducers,
  comment: commentReducers,
  industry: industryReducers,
  job: jobReducers,
  company: companyReducers,
  cv: cvReducers,
  resumes: resumeReducers,
  socket: socketReducers,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
