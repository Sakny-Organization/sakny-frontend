import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications as apiFetchNotifications,
  fetchUnreadCount as apiFetchUnreadCount,
  markNotificationRead as apiMarkRead,
  markAllNotificationsRead as apiMarkAllRead,
} from '../services/notificationApi';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 0, size = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiFetchNotifications(page, size, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiFetchUnreadCount(token);
      return res?.data?.count ?? 0;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load unread count');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiMarkRead(id, token);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to mark as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiMarkAllRead(token);
      return true;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to mark all as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    page: 0,
    totalPages: 0,
    hasMore: false,
    error: null,
  },
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const page = action.payload;
        if (page) {
          state.notifications = page.content || [];
          state.page = page.number ?? 0;
          state.totalPages = page.totalPages ?? 0;
          state.hasMore = (page.number ?? 0) < (page.totalPages ?? 0) - 1;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notif = state.notifications.find((n) => n.id === id);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export const { addRealtimeNotification, setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
