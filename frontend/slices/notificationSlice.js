import { createSlice } from "@reduxjs/toolkit";

const initialNotifications = [
  {
    id: "n1",
    category: "messages",
    type: "message",
    title: "New message from Mohamed Ramadan",
    message:
      "That apartment layout looks great. Want to schedule a quick call tonight?",
    timestamp: "Just now",
    group: "Today",
    read: false,
  },
  {
    id: "n2",
    category: "matches",
    type: "match",
    title: "New high-quality match",
    message:
      "Sarah Ahmed is a 91% compatibility match based on lifestyle and cleanliness.",
    timestamp: "18 minutes ago",
    group: "Today",
    read: false,
  },
  {
    id: "n3",
    category: "messages",
    type: "message",
    title: "Unread conversation reminder",
    message: "Ahmed Bahgat is waiting for your reply about move-in timing.",
    timestamp: "2 hours ago",
    group: "Today",
    read: true,
  },
  {
    id: "n4",
    category: "matches",
    type: "saved",
    title: "Profile saved",
    message:
      "One of your shortlisted profiles updated their location preference.",
    timestamp: "Yesterday",
    group: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    category: "all",
    type: "verification",
    title: "Profile quality suggestion",
    message:
      "Add a clear profile photo to improve visibility in recommendations.",
    timestamp: "2 days ago",
    group: "Earlier",
    read: true,
  },
];

const unreadCount = (notifications) =>
  notifications.filter((notification) => !notification.read).length;

const initialState = {
  notifications: initialNotifications,
  unreadNotifications: unreadCount(initialNotifications),
  activeFilter: "all",
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        (item) => item.id === action.payload,
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotifications = unreadCount(state.notifications);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadNotifications = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadNotifications = unreadCount(state.notifications);
    },
  },
});

export const {
  setNotificationFilter,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
