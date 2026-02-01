import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roommateReducer from './slices/roommateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roommates: roommateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
