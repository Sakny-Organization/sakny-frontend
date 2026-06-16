import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roommateReducer from './slices/roommateSlice';
import notificationReducer from './slices/notificationSlice';
import matchReducer from './slices/matchSlice';
import messagesReducer from './slices/messagesSlice';
import propertyReducer from './slices/propertySlice';
import savedReducer from './slices/savedSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        roommates: roommateReducer,
        notifications: notificationReducer,
        matches: matchReducer,
        messages: messagesReducer,
        properties: propertyReducer,
        saved: savedReducer,
    },
});
