import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Search as SearchIcon, ArrowLeft, Loader } from 'lucide-react';
import Button from '../components/common/Button';
import {
    fetchConversations,
    fetchMessages,
    sendMessage,
    setActiveConversation,
    receiveMessage,
    setUnreadTotal,
} from '../slices/messagesSlice';
import { addRealtimeNotification } from '../slices/notificationSlice';
import * as websocketService from '../services/websocketService';

const Messages = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user, token } = useSelector((state) => state.auth);
    const {
        conversations,
        activeUserId,
        messages,
        loading,
        messagesLoading,
        sendingMessage,
        hasMoreMessages,
        messagesPage,
        unreadTotal,
    } = useSelector((state) => state.messages);

    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Load conversations and connect WebSocket on mount
    useEffect(() => {
        dispatch(fetchConversations());

        if (token) {
            websocketService.connect(
                token,
                (msg) => dispatch(receiveMessage(msg)),
                (payload) => dispatch(setUnreadTotal(payload.totalUnread ?? payload)),
                (notification) => dispatch(addRealtimeNotification(notification))
            );
        }

        return () => {
            websocketService.disconnect();
        };
    }, [dispatch, token]);

    // Handle startWith or startConversation from navigation state
    useEffect(() => {
        const startWith = location.state?.startWith;
        const startConversation = location.state?.startConversation;

        if (startWith) {
            const userId = Number(startWith);
            dispatch(setActiveConversation(userId));
            dispatch(fetchMessages({ userId }));
        } else if (startConversation?.participant) {
            const participant = startConversation.participant;
            const userId = Number(participant.id);
            dispatch(setActiveConversation(userId));
            dispatch(fetchMessages({ userId }));
        }
    }, [dispatch, location.state]);

    // Load messages when active conversation changes
    useEffect(() => {
        if (activeUserId) {
            dispatch(fetchMessages({ userId: activeUserId }));
        }
    }, [dispatch, activeUserId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSelectConversation = (otherUserId) => {
        dispatch(setActiveConversation(otherUserId));
    };

    const handleSendMessage = () => {
        if (!messageText.trim() || !activeUserId) return;

        dispatch(sendMessage({ receiverId: Number(activeUserId), content: messageText.trim() }));
        setMessageText('');
    };

    const handleLoadMore = () => {
        if (hasMoreMessages && activeUserId) {
            dispatch(fetchMessages({ userId: activeUserId, page: messagesPage + 1 }));
        }
    };

    const filteredConversations = conversations.filter(conv =>
        (conv.otherUserName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeConversation = conversations.find(c => c.otherUserId === activeUserId)
        || (activeUserId && location.state?.startConversation?.participant ? {
            otherUserId: activeUserId,
            otherUserName: location.state.startConversation.participant.name || 'User',
            otherUserPhoto: location.state.startConversation.participant.profilePhotoUrl || null,
        } : null);

    // Messages come sorted desc from API, reverse for chronological display
    const chronologicalMessages = [...messages].reverse();

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const currentUserId = user?.userId || user?.id;

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container h-[calc(100vh-8rem)] flex rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white"
        >
            {/* Conversations List */}
            <div className={`flex-col border-r border-gray-200 bg-white ${activeUserId ? 'hidden md:flex md:w-96' : 'w-full md:w-96 flex'}`}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-black">Messages</h2>
                    {unreadTotal > 0 && (
                        <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadTotal}
                        </span>
                    )}
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-200 relative bg-white">
                    <SearchIcon size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader size={24} className="animate-spin text-gray-400" />
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation) => (
                            <button
                                key={conversation.otherUserId}
                                className={`w-full p-4 flex gap-3 transition-colors text-left border-b border-gray-100 last:border-0 hover:bg-gray-50 ${activeUserId === conversation.otherUserId ? 'bg-blue-50/50' : 'bg-white'}`}
                                onClick={() => handleSelectConversation(conversation.otherUserId)}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 font-bold text-lg">
                                    {(conversation.otherUserName || '?')[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-semibold text-black truncate">
                                            {conversation.otherUserName || 'Unknown'}
                                        </span>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {formatTime(conversation.lastMessageSentAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm truncate mr-2 ${conversation.unreadCount > 0 ? 'font-semibold text-black' : 'text-gray-500'}`}>
                                            {conversation.lastMessageContent || 'No messages yet'}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <span className="bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <MessageCircle size={24} className="mb-2 text-gray-300" />
                            <p className="text-sm">No conversations yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-col bg-gray-50 ${activeUserId ? 'flex w-full md:flex-1' : 'hidden md:flex md:flex-1'}`}>
                {activeUserId ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 gap-3 sticky top-0 z-10 shadow-sm md:shadow-none">
                            <button
                                onClick={() => dispatch(setActiveConversation(null))}
                                className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            {activeConversation?.otherUserPhoto ? (
                                <img src={activeConversation.otherUserPhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                    {(activeConversation?.otherUserName || '?')[0].toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-black truncate">
                                    {activeConversation?.otherUserName || 'Conversation'}
                                </h3>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                            {hasMoreMessages && (
                                <div className="text-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="text-sm text-gray-500 hover:text-black transition-colors"
                                    >
                                        Load older messages
                                    </button>
                                </div>
                            )}

                            {messagesLoading && messages.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader size={24} className="animate-spin text-gray-400" />
                                </div>
                            ) : chronologicalMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <MessageCircle size={32} className="mb-2" />
                                    <p className="text-sm">No messages yet. Say hello!</p>
                                </div>
                            ) : (
                                chronologicalMessages.map((message) => {
                                    const isMe = message.senderId === currentUserId;
                                    return (
                                        <div key={message.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold self-end mb-1">
                                                    {(activeConversation?.otherUserName || '?')[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className={`max-w-[75%] md:max-w-[70%] p-3 md:p-4 rounded-2xl ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}`}>
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                <span className={`text-[10px] block mt-1 ${isMe ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                                                    {formatTime(message.sentAt)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex gap-2 md:gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 md:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <Button
                                variant="primary"
                                onClick={handleSendMessage}
                                disabled={!messageText.trim() || sendingMessage}
                                className="rounded-full !p-2 md:!px-4 md:!py-2"
                            >
                                {sendingMessage ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                            <MessageCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">Select a conversation</h3>
                        <p className="text-gray-500 max-w-xs">
                            Choose a conversation from the list to start messaging your potential roommates.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Messages;
