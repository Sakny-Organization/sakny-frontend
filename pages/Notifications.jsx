import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationAsRead, markAllNotificationsAsRead, setNotificationFilter } from '../slices/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings } from 'lucide-react';
import Button from '../components/common/Button';
import NotificationItem from '../components/NotificationItem';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/common/PageTransition';

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications, unreadNotifications, activeFilter } = useSelector((state) => state.notifications);
    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };
    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsAsRead());
    };
    const filteredNotifications = notifications.filter((notification) => {
        if (activeFilter === 'all') return true;
        return notification.category === activeFilter;
    });
    const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
        const key = notification.group || 'Earlier';
        if (!groups[key]) groups[key] = [];
        groups[key].push(notification);
        return groups;
    }, {});
    
    return (<PageTransition>
        <div className="app-container notification-center">
            {/* Header */}
            <div className="notifications-header">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                    <p className="text-gray-600">
                        {unreadNotifications > 0 ? `${unreadNotifications} unread notification${unreadNotifications > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                <div className="header-actions">
                    {unreadNotifications > 0 && (<Button variant="outline" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>)}
                    <Button variant="ghost">
                        <Settings size={18}/>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="notification-tabs">
                <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => dispatch(setNotificationFilter('all'))}>
                    All
                </button>
                <button className={`filter-btn ${activeFilter === 'messages' ? 'active' : ''}`} onClick={() => dispatch(setNotificationFilter('messages'))}>
                    Messages
                </button>
                <button className={`filter-btn ${activeFilter === 'matches' ? 'active' : ''}`} onClick={() => dispatch(setNotificationFilter('matches'))}>
                    Matches
                </button>
            </div>

            {/* Notifications List */}
            <AnimatePresence mode="popLayout">
                <motion.div className="notifications-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {filteredNotifications.length > 0 ? (
                        Object.entries(groupedNotifications).map(([group, items]) => (<div key={group} className="notification-group">
                            <div className="notification-group__title">{group}</div>
                            <AnimatePresence>
                                {items.map((notification) => (<NotificationItem key={notification.id} notification={notification} onRead={handleMarkAsRead} />))}
                            </AnimatePresence>
                        </div>))
                    ) : (
                        <EmptyState
                            icon={<Bell size={28} />}
                            title="No notifications"
                            description="This feed will surface new messages, high-quality matches, and profile activity as soon as they happen."
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    </PageTransition>);
};
export default Notifications;
