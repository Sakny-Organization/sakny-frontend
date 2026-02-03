import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Search as SearchIcon, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { containerVariants, itemVariants } from '../utils/animations';
const Messages = () => {
    const { user } = useSelector((state) => state.auth);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    // Mock conversations data
    const [conversations] = useState([
        {
            id: '1',
            roommateId: '1',
            roommateName: 'Mohamed Ramadan',
            roommateAvatar: 'https://i.pravatar.cc/150?img=1',
            lastMessage: 'Great! When can we meet to discuss?',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            unreadCount: 2,
            messages: [
                {
                    id: 'm1',
                    senderId: 'user',
                    text: 'Hi! I saw your profile and I think we could be a good match.',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                    read: true,
                },
                {
                    id: 'm2',
                    senderId: '1',
                    text: 'Hello! Thanks for reaching out. I agree, our preferences seem to align well.',
                    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
                    read: true,
                },
                {
                    id: 'm3',
                    senderId: 'user',
                    text: 'Would you like to meet up to discuss the apartment details?',
                    timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
                    read: true,
                },
                {
                    id: 'm4',
                    senderId: '1',
                    text: 'Great! When can we meet to discuss?',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
                    read: false,
                },
            ],
        },
        {
            id: '2',
            roommateId: '2',
            roommateName: 'Ahmed Tarek',
            roommateAvatar: 'https://i.pravatar.cc/150?img=2',
            lastMessage: 'Sounds good to me!',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            unreadCount: 0,
            messages: [
                {
                    id: 'm5',
                    senderId: 'user',
                    text: 'Hey! Are you still looking for a roommate?',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
                    read: true,
                },
                {
                    id: 'm6',
                    senderId: '2',
                    text: 'Sounds good to me!',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                    read: true,
                },
            ],
        },
    ]);
    const filteredConversations = conversations.filter(conv => conv.roommateName.toLowerCase().includes(searchQuery.toLowerCase()));
    const activeConversation = conversations.find(c => c.id === selectedConversation);
    const formatTime = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        if (days < 7)
            return `${days}d ago`;
        return date.toLocaleDateString();
    };
    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        // In real app, dispatch action to send message
        setMessageText('');
    };
    if (!user)
        return null;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container h-[calc(100vh-8rem)] flex rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white"
        >
            {/* Conversations List */}
            <div className={`flex-col border-r border-gray-200 bg-white ${selectedConversation ? 'hidden md:flex md:w-96' : 'w-full md:w-96 flex'}`}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-black">Messages</h2>
                    <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                    </span>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-200 relative bg-white">
                    <SearchIcon size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-black outline-none"/>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length > 0 ? (filteredConversations.map((conversation) => (<button key={conversation.id} className={`w-full p-4 flex gap-3 transition-colors text-left border-b border-gray-100 last:border-0 hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-blue-50/50' : 'bg-white'}`} onClick={() => setSelectedConversation(conversation.id)}>
                                <img src={conversation.roommateAvatar} alt={conversation.roommateName} className="size-12 rounded-full object-cover flex-shrink-0"/>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-semibold text-black truncate">{conversation.roommateName}</span>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {formatTime(conversation.lastMessageTime)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm truncate mr-2 ${conversation.unreadCount > 0 ? 'font-semibold text-black' : 'text-gray-500'}`}>
                                            {conversation.lastMessage}
                                        </p>
                                        {conversation.unreadCount > 0 && (<span className="bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">{conversation.unreadCount}</span>)}
                                    </div>
                                </div>
                            </button>))) : (<div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <p>No conversations found</p>
                        </div>)}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-col bg-gray-50 ${selectedConversation ? 'flex w-full md:flex-1' : 'hidden md:flex md:flex-1'}`}>
                {activeConversation ? (<>
                        {/* Chat Header */}
                        <div className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 gap-3 sticky top-0 z-10 shadow-sm md:shadow-none">
                            <button onClick={() => setSelectedConversation(null)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
                                <ArrowLeft size={20}/>
                            </button>
                            <img src={activeConversation.roommateAvatar} alt={activeConversation.roommateName} className="size-10 rounded-full object-cover"/>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-black truncate">{activeConversation.roommateName}</h3>
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Active now
                                </span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                            {activeConversation.messages.map((message) => (<div key={message.id} className={`flex gap-3 ${message.senderId === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {message.senderId !== 'user' && (<img src={activeConversation.roommateAvatar} alt="" className="size-8 rounded-full object-cover self-end mb-1"/>)}
                                    <div className={`max-w-[75%] md:max-w-[70%] p-3 md:p-4 rounded-2xl ${message.senderId === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}`}>
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <span className={`text-[10px] block mt-1 ${message.senderId === 'user' ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                                            {formatTime(message.timestamp)}
                                        </span>
                                    </div>
                                </div>))}
                        </div>

                        {/* Message Input */}
                        <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex gap-2 md:gap-4 items-center">
                            <input type="text" placeholder="Type a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 md:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"/>
                            <Button variant="primary" onClick={handleSendMessage} disabled={!messageText.trim()} className="rounded-full !p-2 md:!px-4 md:!py-2">
                                <Send size={18}/>
                            </Button>
                        </div>
                    </>) : (<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
                            <MessageCircle size={32}/>
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">Select a conversation</h3>
                        <p className="text-gray-500 max-w-xs">
                            Choose a conversation from the list to start messaging your potential roommates.
                        </p>
                    </div>)}
            </div>
        </motion.div>
    );
};
export default Messages;
