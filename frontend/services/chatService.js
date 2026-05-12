const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const INITIAL_CONVERSATIONS = [
  {
    id: "c1",
    participant: {
      id: "r1",
      name: "Mohamed Ramadan",
      avatar: "https://i.pravatar.cc/150?img=12",
      status: "online",
      lastSeen: "Active now",
      matchPercentage: 90,
    },
    unreadCount: 2,
    typing: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    messages: [
      {
        id: "m1",
        senderId: "user",
        text: "Hi Mohamed, your profile looks like a strong fit for my lifestyle.",
        timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
        status: "seen",
      },
      {
        id: "m2",
        senderId: "r1",
        text: "Thanks, I noticed the same. Are you mainly looking around Downtown?",
        timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
        status: "seen",
      },
      {
        id: "m3",
        senderId: "user",
        text: "Yes, Downtown or nearby. I also care a lot about cleanliness and quiet evenings.",
        timestamp: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
        status: "delivered",
      },
      {
        id: "m4",
        senderId: "r1",
        text: "That aligns well with me. I can share more details about the apartment tonight.",
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        status: "delivered",
      },
    ],
  },
  {
    id: "c2",
    participant: {
      id: "r2",
      name: "Mohamed Bahgat",
      avatar: "https://i.pravatar.cc/150?img=14",
      status: "offline",
      lastSeen: "Seen 2 hours ago",
      matchPercentage: 88,
    },
    unreadCount: 0,
    typing: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    messages: [
      {
        id: "m5",
        senderId: "user",
        text: "Hey Ahmed, is the room still available next month?",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: "seen",
      },
      {
        id: "m6",
        senderId: "r2",
        text: "Yes, it should be. I am just finalizing the move-out date with the current tenant.",
        timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
        status: "seen",
      },
    ],
  },
  {
    id: "c3",
    participant: {
      id: "r6",
      name: "Sarah Ahmed",
      avatar: "https://i.pravatar.cc/150?img=20",
      status: "online",
      lastSeen: "Active now",
      matchPercentage: 91,
    },
    unreadCount: 1,
    typing: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    messages: [
      {
        id: "m7",
        senderId: "r6",
        text: "I like your profile setup. We seem aligned on pets and cleanliness.",
        timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
        status: "delivered",
      },
    ],
  },
];

export const getConversations = async () => {
  await delay(300);
  return INITIAL_CONVERSATIONS;
};

export const sendMessage = async ({ conversationId, senderId, text }) => {
  await delay(160);
  return {
    conversationId,
    message: {
      id: `m-${Date.now()}`,
      senderId,
      text,
      timestamp: new Date().toISOString(),
      status: "sending",
    },
  };
};

export const subscribeToConversation = () => () => {};

export default {
  getConversations,
  sendMessage,
  subscribeToConversation,
};
