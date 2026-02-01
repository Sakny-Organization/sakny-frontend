import React, { useState } from 'react';
import { Bell, MessageCircle, Heart, Eye, UserCheck, Settings } from 'lucide-react';
import Button from '../components/common/Button';

interface Notification {
    id: string;
    type: 'message' | 'match' | 'view' | 'save' | 'verification';
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}

const Notifications: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'message',
            title: 'New message from Mohamed Ramadan',
            description: 'Great! When can we meet to discuss?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            read: false,
            actionUrl: '/messages',
        },
        {
            id: '2',
            type: 'match',
            title: 'New match found!',
            description: 'Ahmed Tarek (92% match) matches your preferences',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            read: false,
            actionUrl: '/match/2',
        },
        {
            id: '3',
            type: 'view',
            title: 'Profile view',
            description: 'Sara Ahmed viewed your profile',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
            read: true,
        },
        {
            id: '4',
            type: 'save',
            title: 'Someone saved your profile',
            description: 'Your profile was saved by a potential roommate',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            read: true,
        },
        {
            id: '5',
            type: 'verification',
            title: 'Verification reminder',
            description: 'Complete your profile verification to get more matches',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            read: true,
            actionUrl: '/profile',
        },
    ]);

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'message':
                return <MessageCircle size={20} />;
            case 'match':
                return <Heart size={20} />;
            case 'view':
                return <Eye size={20} />;
            case 'save':
                return <Heart size={20} />;
            case 'verification':
                return <UserCheck size={20} />;
            default:
                return <Bell size={20} />;
        }
    };

    const getIconColor = (type: Notification['type']) => {
        switch (type) {
            case 'message':
                return 'icon-blue';
            case 'match':
                return 'icon-red';
            case 'view':
                return 'icon-purple';
            case 'save':
                return 'icon-pink';
            case 'verification':
                return 'icon-green';
            default:
                return 'icon-gray';
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notifications-page">
            <div className="container py-8">
                {/* Header */}
                <div className="notifications-header">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                        <p className="text-gray-600">
                            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    <div className="header-actions">
                        {unreadCount > 0 && (
                            <Button variant="outline" onClick={markAllAsRead}>
                                Mark all as read
                            </Button>
                        )}
                        <Button variant="ghost">
                            <Settings size={18} />
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="notifications-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                </div>

                {/* Notifications List */}
                <div className="notifications-list">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className={`notification-icon ${getIconColor(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="notification-content">
                                    <h3 className="notification-title">{notification.title}</h3>
                                    <p className="notification-description">{notification.description}</p>
                                    <span className="notification-time">{formatTime(notification.timestamp)}</span>
                                </div>
                                {!notification.read && <div className="unread-indicator" />}
                            </div>
                        ))
                    ) : (
                        <div className="empty-notifications">
                            <Bell size={64} className="empty-icon" />
                            <h3 className="empty-title">No notifications</h3>
                            <p className="empty-description">
                                {filter === 'unread'
                                    ? "You're all caught up! No unread notifications."
                                    : "You don't have any notifications yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
