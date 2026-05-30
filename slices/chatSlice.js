import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatService from "../services/chatService";

export const loadConversations = createAsyncThunk(
  "chat/loadConversations",
  async () => {
    return chatService.getConversations();
  },
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async ({ conversationId, text }) => {
    return chatService.sendMessage({ conversationId, senderId: "user", text });
  },
);

const initialState = {
  conversations: [],
  selectedConversationId: null,
  status: "idle",
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectConversation: (state, action) => {
      state.selectedConversationId = action.payload;
      const conversation = state.conversations.find(
        (item) => item.id === action.payload,
      );
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
    setConversationTyping: (state, action) => {
      const { conversationId, typing } = action.payload;
      const conversation = state.conversations.find(
        (item) => item.id === conversationId,
      );
      if (conversation) {
        conversation.typing = typing;
      }
    },
    addIncomingMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(
        (item) => item.id === conversationId,
      );
      if (!conversation) {
        return;
      }

      conversation.messages.push(message);
      conversation.updatedAt = message.timestamp;
      if (state.selectedConversationId !== conversationId) {
        conversation.unreadCount += 1;
      }
    },
    ensureConversation: (state, action) => {
      const { id, participant } = action.payload;
      const existingConversation = state.conversations.find(
        (item) => item.id === id,
      );

      if (!existingConversation) {
        state.conversations.unshift({
          id,
          participant,
          unreadCount: 0,
          typing: false,
          updatedAt: new Date().toISOString(),
          messages: [],
        });
        return;
      }

      existingConversation.participant = {
        ...existingConversation.participant,
        ...participant,
      };
      existingConversation.updatedAt = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
        if (!state.selectedConversationId && action.payload.length > 0) {
          state.selectedConversationId = action.payload[0].id;
          state.conversations[0].unreadCount = 0;
        }
      })
      .addCase(loadConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load conversations";
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        const conversation = state.conversations.find(
          (item) => item.id === conversationId,
        );
        if (!conversation) {
          return;
        }

        conversation.messages.push({ ...message, status: "sent" });
        conversation.updatedAt = message.timestamp;
      });
  },
});

export const {
  selectConversation,
  setConversationTyping,
  addIncomingMessage,
  ensureConversation,
} = chatSlice.actions;
export default chatSlice.reducer;
