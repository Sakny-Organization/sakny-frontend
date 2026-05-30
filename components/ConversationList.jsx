import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { hoverLift, itemVariants, listContainer } from '../utils/animations';

const formatRelative = (timestamp) => {
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${Math.max(minutes, 1)}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
};

const ConversationList = ({ conversations, selectedConversationId, onSelect, searchQuery, onSearchChange }) => {
  return (
    <div className="conversation-list">
      <div className="conversation-list__header">
        <div>
          <h2>Messages</h2>
          <p>{conversations.length} active conversations</p>
        </div>
      </div>

      <div className="conversation-list__search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search conversations"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <motion.div className="conversation-list__items" variants={listContainer} initial="initial" animate="animate">
        {conversations.map((conversation) => (
          <motion.button
            key={conversation.id}
            type="button"
            className={`conversation-list__item ${selectedConversationId === conversation.id ? 'is-active' : ''}`}
            onClick={() => onSelect(conversation.id)}
            variants={itemVariants}
          >
            <motion.div className="conversation-list__item-shell" variants={hoverLift} initial="rest" animate="rest" whileHover="hover">
              <div className="conversation-list__avatar-wrap">
                <img src={conversation.participant.avatar} alt={conversation.participant.name} className="conversation-list__avatar" />
                <span className={`conversation-list__status conversation-list__status--${conversation.participant.status}`} />
              </div>
              <div className="conversation-list__content">
                <div className="conversation-list__row">
                  <strong>{conversation.participant.name}</strong>
                  <span>{formatRelative(conversation.updatedAt)}</span>
                </div>
                <div className="conversation-list__row conversation-list__row--subtle">
                  <span>{conversation.messages[conversation.messages.length - 1]?.text || 'No messages yet'}</span>
                  {conversation.unreadCount > 0 && <span className="conversation-list__badge">{conversation.unreadCount}</span>}
                </div>
                <div className="conversation-list__meta">
                  <span>{conversation.participant.lastSeen}</span>
                  <span>{conversation.participant.matchPercentage}% match</span>
                </div>
              </div>
            </motion.div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default ConversationList;