import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Eye, Heart, MessageCircle, ShieldCheck } from 'lucide-react';
import { notificationVariants } from '../utils/animations';

const iconMap = {
  message: <MessageCircle size={18} />,
  match: <Heart size={18} />,
  saved: <Heart size={18} />,
  view: <Eye size={18} />,
  verification: <ShieldCheck size={18} />,
};

const toneMap = {
  message: 'icon-blue',
  match: 'icon-red',
  saved: 'icon-pink',
  view: 'icon-gray',
  verification: 'icon-green',
};

const NotificationItem = ({ notification, onRead }) => {
  return (
    <motion.button
      type="button"
      className={`notification-card ${!notification.read ? 'is-unread' : ''}`}
      onClick={() => onRead(notification.id)}
      variants={notificationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <div className={`notification-card__icon ${toneMap[notification.type] || 'icon-gray'}`}>
        {iconMap[notification.type] || <Bell size={18} />}
      </div>
      <div className="notification-card__body">
        <div className="notification-card__meta">
          <strong>{notification.title}</strong>
          <span>{notification.timestamp}</span>
        </div>
        <p>{notification.message}</p>
      </div>
      {!notification.read && <span className="notification-card__dot" />}
    </motion.button>
  );
};

export default NotificationItem;