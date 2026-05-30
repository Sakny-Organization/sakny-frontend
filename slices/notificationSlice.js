import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    notifications: [
        {
            id: '1',
            type: 'message',
            title: 'New message from Mohamed Ramadan',
            message: 'Great! When can we meet to discuss?',
            timestamp: '30 minutes ago',
            read: false,
            icon: '💬',
        },
        {
            id: '2',
            type: 'match',
            title: 'New match found!',
            message: 'Ahmed Tarek (92% match) matches your preferences',
            timestamp: '2 hours ago',
            read: false,
            icon: '❤️',
        },
        {
            id: '3',
            type: 'view',
            title: 'Profile view',
            message: 'Sara Ahmed viewed your profile',
            timestamp: '5 hours ago',
            read: true,
            icon: '👁️',
        },
        {
            id: '4',
            type: 'saved',
            title: 'Someone saved your profile',
            message: 'Your profile was saved by a potential roommate',
            timestamp: '1 day ago',
            read: true,
            icon: '💾',
        },
        {
            id: '5',
            type: 'verification',
            title: 'Verification reminder',
            message: 'Complete your profile verification to get more matches',
            timestamp: '2 days ago',
            read: true,
            icon: '✅',
        },
    ],
    messages: [
        {
            id: '1',
            senderId: 'user1',
            senderName: 'Mohamed Ramadan',
            senderAvatar: 'https://i.pravatar.cc/150?u=user1',
            content: 'Great! When can we meet to discuss?',
            timestamp: '30 minutes ago',
            read: false,
        },
        {
            id: '2',
            senderId: 'user2',
            senderName: 'Sara Ahmed',
            senderAvatar: 'https://i.pravatar.cc/150?u=user2',
            content: 'Hi! I saw your profile and I think we would be a great match!',
            timestamp: '2 hours ago',
            read: false,
        },
        {
            id: '3',
            senderId: 'user3',
            senderName: 'Ahmed Ali',
            senderAvatar: 'https://i.pravatar.cc/150?u=user3',
            content: 'Are you still looking for a roommate?',
            timestamp: '5 hours ago',
            read: false,
        },
    ],
    unreadNotifications: 2,
    unreadMessages: 3,
};
const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        markNotificationAsRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
            }
        },
        markAllNotificationsAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
            state.unreadNotifications = 0;
        },
        markMessageAsRead: (state, action) => {
            const message = state.messages.find(m => m.id === action.payload);
            if (message && !message.read) {
                message.read = true;
                state.unreadMessages = Math.max(0, state.unreadMessages - 1);
            }
        },
        markAllMessagesAsRead: (state) => {
            state.messages.forEach(m => m.read = true);
            state.unreadMessages = 0;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadNotifications += 1;
            }
        },
        addMessage: (state, action) => {
            state.messages.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadMessages += 1;
            }
        },
    },
});
export const { markNotificationAsRead, markAllNotificationsAsRead, markMessageAsRead, markAllMessagesAsRead, addNotification, addMessage, } = notificationSlice.actions;
export default notificationSlice.reducer;
