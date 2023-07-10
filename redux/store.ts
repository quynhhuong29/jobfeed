import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducers from "./reducers/authReducers";
import commentReducers from "./reducers/commentReducers";
import companyReducers from "./reducers/companyReducers";
import cvReducers from "./reducers/cvReducers";
import industryReducers from "./reducers/industryReducers";
import jobReducers from "./reducers/jobReducers";
import notifyReducers from "./reducers/notifyReducers";
import postReducers from "./reducers/postReducers";
import resumeReducers from "./reducers/resumeReducers";
import socketReducers from "./reducers/socketReducers";
import submitReducers from "./reducers/submitReducers";
import userReducers from "./reducers/userReducers";
import peerReducers from "./reducers/peerReducers";
import callReducers from "./reducers/callReducers";
import onlineReducers from "./reducers/onlineReducers";
import messageReducers from "./reducers/messageReducers";
import adminReducers from "./reducers/adminReducers";

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
  peer: peerReducers,
  call: callReducers,
  online: onlineReducers,
  message: messageReducers,
  notify: notifyReducers,
  submit: submitReducers,
  admin: adminReducers,
});

// Create a separate function to configure and return the store
const configureAppStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

// Export the store directly from the module
export const store = configureAppStore();

// Define the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the useDispatch hook using the correct syntax
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Export the configured store as the default export
export default store;
