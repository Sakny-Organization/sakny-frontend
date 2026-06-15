import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import Button from './common/Button';
import EmptyState from './EmptyState';
import {
  messageItemVariants,
  messageListVariants,
  premiumEase,
  typingContainerVariants,
  typingDotVariants,
} from '../utils/animations';

const formatMessageTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], {
  hour: 'numeric',
  minute: '2-digit',
});

const ChatWindow = ({ conversation, onBack, onSend, isMobile }) => {
  const [draft, setDraft] = React.useState('');
  const endRef = React.useRef(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversation?.messages?.length, conversation?.typing]);

  React.useEffect(() => {
    setDraft('');
  }, [conversation?.id]);

  if (!conversation) {
    return (
      <div className="chat-window chat-window--empty">
        <EmptyState
          icon={<MessageCircle size={28} />}
          title="Select a conversation"
          description="Choose a conversation from the sidebar to review messages, see online status, and continue the chat."
          className="chat-empty-state"
        />
      </div>
    );
  }

  return (
    <motion.div
      key={conversation.id}
      className="chat-window"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22, ease: premiumEase }}
      layout
    >
      <div className="chat-window__header">
        {isMobile && (
          <button type="button" className="chat-window__back" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="chat-window__avatar-wrap">
          <img src={conversation.participant.avatar} alt={conversation.participant.name} className="chat-window__avatar" />
          <span className={`conversation-list__status conversation-list__status--${conversation.participant.status}`} />
        </div>
        <div className="chat-window__header-copy">
          <strong>{conversation.participant.name}</strong>
          <span>{conversation.participant.lastSeen}</span>
        </div>
        <div className="chat-window__match-badge">{conversation.participant.matchPercentage}% match</div>
      </div>

      <motion.div className="chat-window__messages" variants={messageListVariants} initial="initial" animate="animate">
        {conversation.messages.map((message) => {
          const isOwn = message.senderId === 'user';
          return (
            <motion.div
              key={message.id}
              className={`chat-window__message ${isOwn ? 'is-own' : ''}`}
              variants={messageItemVariants}
            >
              {!isOwn && <img src={conversation.participant.avatar} alt="" className="chat-window__message-avatar" />}
              <div className={`chat-window__bubble ${isOwn ? 'is-own' : ''}`}>
                <p>{message.text}</p>
                <span>{formatMessageTime(message.timestamp)}</span>
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {conversation.typing && (
            <motion.div className="chat-window__typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <img src={conversation.participant.avatar} alt="" className="chat-window__message-avatar" />
              <motion.div className="chat-window__typing-bubble" variants={typingContainerVariants} initial="initial" animate="animate">
                {[0, 1, 2].map((dot) => (
                  <motion.span key={dot} className="chat-window__typing-dot" variants={typingDotVariants} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </motion.div>

      <form
        className="chat-window__composer"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) {
            return;
          }

          onSend(draft.trim());
          setDraft('');
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message"
        />
        <Button type="submit" variant="primary" className="chat-window__send" disabled={!draft.trim()}>
          <Send size={16} />
          <span>Send</span>
        </Button>
      </form>
    </motion.div>
  );
};

export default ChatWindow;