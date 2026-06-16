import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/^http/, 'ws') + '/ws';
const RECONNECT_DELAY = 5000;

let client = null;
let _onMessage = null;
let _onUnreadCount = null;
let _onNotification = null;
let _token = null;
let _connected = false;

export const isConnected = () => _connected;

export const connect = (token, onMessage, onUnreadCount, onNotification) => {
  if (client && _connected) return;

  _token = token;
  _onMessage = onMessage;
  _onUnreadCount = onUnreadCount;
  _onNotification = onNotification;

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL.replace(/^ws/, 'http')),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: RECONNECT_DELAY,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      _connected = true;

      client.subscribe('/user/queue/messages', (frame) => {
        try {
          const msg = JSON.parse(frame.body);
          if (_onMessage) _onMessage(msg);
        } catch {
          // ignore malformed frames
        }
      });

      client.subscribe('/user/queue/unread-count', (frame) => {
        try {
          const payload = JSON.parse(frame.body);
          if (_onUnreadCount) _onUnreadCount(payload);
        } catch {
          // ignore malformed frames
        }
      });

      client.subscribe('/user/queue/notifications', (frame) => {
        try {
          const notification = JSON.parse(frame.body);
          if (_onNotification) _onNotification(notification);
        } catch {
          // ignore malformed frames
        }
      });
    },
    onDisconnect: () => {
      _connected = false;
    },
    onStompError: () => {
      _connected = false;
    },
  });

  client.activate();
};

export const send = (receiverId, content) => {
  if (client && _connected) {
    client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ receiverId, content }),
    });
    return true;
  }
  return false;
};

export const disconnect = () => {
  if (client) {
    client.deactivate();
    client = null;
    _connected = false;
  }
};
