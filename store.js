import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import matchReducer from "./slices/matchSlice";
import chatReducer from "./slices/chatSlice";
import notificationReducer from "./slices/notificationSlice";
import savedReducer, { SAVED_STORAGE_KEY } from "./slices/savedSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchReducer,
    chat: chatReducer,
    saved: savedReducer,
    notifications: notificationReducer,
  },
});

store.subscribe(() => {
  if (typeof window === "undefined") {
    return;
  }

  const { saved } = store.getState();
  window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved.ids));
});
