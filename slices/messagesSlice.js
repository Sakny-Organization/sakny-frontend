import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getConversations as apiGetConversations,
  getMessages as apiGetMessages,
  sendMessageRest as apiSendMessage,
  markMessageRead as apiMarkRead,
} from '../services/messageApi';

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async ({ page = 0, size = 20 } = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiGetConversations(page, size, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ userId, page = 0 }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiGetMessages(userId, page, 20, token);
      return { page: res?.data, userId, pageNum: page };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiverId, content }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiSendMessage(receiverId, content, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to send message');
    }
  }
);

export const markRead = createAsyncThunk(
  'messages/markRead',
  async (messageId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await apiMarkRead(messageId, token);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to mark as read');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    conversationsPage: 0,
    conversationsTotalPages: 0,
    activeUserId: null,
    messages: [],
    messagesPage: 0,
    messagesTotalPages: 0,
    hasMoreMessages: false,
    unreadTotal: 0,
    loading: false,
    messagesLoading: false,
    sendingMessage: false,
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      if (state.activeUserId !== action.payload) {
        state.activeUserId = action.payload;
        state.messages = [];
        state.messagesPage = 0;
        state.messagesTotalPages = 0;
        state.hasMoreMessages = false;
      }
    },
    receiveMessage: (state, action) => {
      const msg = action.payload;
      // Prepend to messages list if this is the active conversation
      if (
        state.activeUserId === msg.senderId ||
        state.activeUserId === msg.receiverId
      ) {
        const exists = state.messages.some((m) => m.id === msg.id);
        if (!exists) state.messages.unshift(msg);
      }
      // Update conversation snippet
      const conv = state.conversations.find(
        (c) => c.otherUserId === msg.senderId || c.otherUserId === msg.receiverId
      );
      if (conv) {
        conv.lastMessageContent = msg.content;
        conv.lastMessageSentAt = msg.sentAt;
        if (state.activeUserId !== msg.senderId) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
      }
    },
    setUnreadTotal: (state, action) => {
      state.unreadTotal = action.payload;
    },
    updateUnreadFromWs: (state, action) => {
      const { conversationId, unreadCount } = action.payload;
      const conv = state.conversations.find((c) => c.conversationId === conversationId);
      if (conv) conv.unreadCount = unreadCount;
      state.unreadTotal = state.conversations.reduce(
        (sum, c) => sum + (c.unreadCount || 0),
        0
      );
    },
    clearMessagesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        const page = action.payload;
        if (page) {
          state.conversations = page.content || [];
          state.conversationsPage = page.number ?? 0;
          state.conversationsTotalPages = page.totalPages ?? 0;
          state.unreadTotal = state.conversations.reduce(
            (sum, c) => sum + (c.unreadCount || 0),
            0
          );
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Message history
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const { page, pageNum } = action.payload;
        if (page) {
          // Append older messages (page > 0) or replace (page 0)
          if (pageNum === 0) {
            state.messages = page.content || [];
          } else {
            state.messages = [...state.messages, ...(page.content || [])];
          }
          state.messagesPage = page.number ?? 0;
          state.messagesTotalPages = page.totalPages ?? 0;
          state.hasMoreMessages = (page.number ?? 0) < (page.totalPages ?? 0) - 1;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })

      // Send message (REST fallback)
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const msg = action.payload;
        if (msg) {
          const exists = state.messages.some((m) => m.id === msg.id);
          if (!exists) state.messages.unshift(msg);
          // Update conversation snippet
          const conv = state.conversations.find(
            (c) => c.otherUserId === msg.receiverId
          );
          if (conv) {
            conv.lastMessageContent = msg.content;
            conv.lastMessageSentAt = msg.sentAt;
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      })

      // Mark read
      .addCase(markRead.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const idx = state.messages.findIndex((m) => m.id === updated.id);
        if (idx !== -1) state.messages[idx] = updated;
      });
  },
});

export const {
  setActiveConversation,
  receiveMessage,
  setUnreadTotal,
  updateUnreadFromWs,
  clearMessagesError,
} = messagesSlice.actions;

export default messagesSlice.reducer;
