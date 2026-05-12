import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
import ConversationList from '../components/ConversationList';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/common/PageTransition';
import { ensureConversation, loadConversations, selectConversation, sendChatMessage } from '../slices/chatSlice';

const Messages = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { conversations, selectedConversationId, status } = useSelector((state) => state.chat);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const startedConversationRef = React.useRef(null);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(loadConversations());
        }
    }, [dispatch, status]);

    React.useEffect(() => {
        const updateViewport = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    React.useEffect(() => {
        const payload = location.state?.startConversation;
        if (!payload || status === 'loading') {
            return;
        }

        const conversationId = `conversation-${payload.participant.id}`;
        if (startedConversationRef.current === conversationId) {
            return;
        }

        startedConversationRef.current = conversationId;
        dispatch(ensureConversation({
            id: conversationId,
            participant: payload.participant,
        }));
        dispatch(selectConversation(conversationId));
    }, [dispatch, location.state, status]);

    const filteredConversations = React.useMemo(() => conversations.filter((conversation) => conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase())), [conversations, searchQuery]);
    const activeConversation = conversations.find((conversation) => conversation.id === selectedConversationId) || null;

    if (!user)
        return null;

    return (<PageTransition>
        <div className="app-container">
            <div className="messages-layout">
                <div className={`messages-layout__sidebar ${isMobile && activeConversation ? 'is-hidden' : ''}`}>
                    {status === 'loading' && (
                        <div className="messages-loading-list">
                            {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} compact />)}
                        </div>
                    )}

                    {status !== 'loading' && filteredConversations.length > 0 && (
                        <ConversationList
                            conversations={filteredConversations}
                            selectedConversationId={selectedConversationId}
                            onSelect={(conversationId) => dispatch(selectConversation(conversationId))}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    )}

                    {status !== 'loading' && filteredConversations.length === 0 && (
                        <EmptyState
                            icon={<MessageCircle size={26} />}
                            title="No conversations found"
                            description="Try another name or clear the search to review all message threads."
                        />
                    )}
                </div>

                <div className={`messages-layout__main ${isMobile && !activeConversation ? 'is-hidden' : ''}`}>
                    <AnimatePresence mode="wait">
                        <ChatWindow
                            key={activeConversation?.id || 'empty'}
                            conversation={activeConversation}
                            isMobile={isMobile}
                            onBack={() => dispatch(selectConversation(null))}
                            onSend={(text) => {
                                if (selectedConversationId) {
                                    dispatch(sendChatMessage({ conversationId: selectedConversationId, text }));
                                }
                            }}
                        />
                    </AnimatePresence>
                </div>
            </div>
        </div>
    </PageTransition>);
};
export default Messages;
