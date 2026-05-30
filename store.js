import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roommateReducer from './slices/roommateSlice';
import notificationReducer from './slices/notificationSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        roommates: roommateReducer,
        notifications: notificationReducer,
    },
});
