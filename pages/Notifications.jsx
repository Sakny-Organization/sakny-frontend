import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../slices/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageCircle, Heart, Eye, UserCheck, Settings } from 'lucide-react';
import Button from '../components/common/Button';
import { containerVariants, itemVariants } from '../utils/animations';
const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications, unreadNotifications } = useSelector((state) => state.notifications);
    const [filter, setFilter] = useState('all');
    const getIcon = (type) => {
        switch (type) {
            case 'message':
                return <MessageCircle size={20}/>;
            case 'match':
                return <Heart size={20}/>;
            case 'view':
                return <Eye size={20}/>;
            case 'saved':
                return <Heart size={20}/>;
            case 'verification':
                return <UserCheck size={20}/>;
            default:
                return <Bell size={20}/>;
        }
    };
    const getIconColor = (type) => {
        switch (type) {
            case 'message':
                return 'icon-blue';
            case 'match':
                return 'icon-red';
            case 'view':
                return 'icon-purple';
            case 'saved':
                return 'icon-pink';
            case 'verification':
                return 'icon-green';
            default:
                return 'icon-gray';
        }
    };
    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };
    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsAsRead());
    };
    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
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
            <div className="notifications-filters">
                <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    All
                </button>
                <button className={`filter-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
                    Unread {unreadNotifications > 0 && `(${unreadNotifications})`}
                </button>
            </div>

            {/* Notifications List */}
            <AnimatePresence mode="popLayout">
                <motion.div 
                    className="notifications-list"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                >
                    {filteredNotifications.length > 0 ? (
                        <AnimatePresence>
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    variants={itemVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit={{ opacity: 0, x: -20 }}
                                    layout
                                >
                                    <div className={`notification-icon ${getIconColor(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <h3 className="notification-title">{notification.title}</h3>
                                        <p className="notification-description">{notification.message}</p>
                                        <span className="notification-time">{notification.timestamp}</span>
                                    </div>
                                    {!notification.read && <div className="unread-indicator"/>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <motion.div 
                            className="empty-notifications"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Bell size={64} className="empty-icon"/>
                            <h3 className="empty-title">No notifications</h3>
                            <p className="empty-description">
                                {filter === 'unread'
                                    ? "You're all caught up! No unread notifications."
                                    : "You don't have any notifications yet."}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};
export default Notifications;
