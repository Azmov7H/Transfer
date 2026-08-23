/**
 * Notification Service — owns the /api/notifications endpoint contract.
 * UI/hooks must not hardcode these URLs (FE-DATA-005, D2/D10).
 */
import { api } from '@/lib/api-utils';

/**
 * @typedef {Object} Notification
 * @property {string} _id
 * @property {string} title
 * @property {string} [message]
 * @property {boolean} isRead
 */

/** @param {{signal?: AbortSignal}} [options] @returns {Promise<{notifications: Notification[], unreadCount: number}>} */
export const getNotifications = (options) => api.get('/api/notifications?limit=20', undefined, options);

/** @param {string[]|'all'} ids @returns {Promise<*>} */
export const markNotificationsRead = (ids = 'all') => api.patch('/api/notifications/mark-read', { ids });

/** @param {string} id @returns {Promise<*>} */
export const deleteNotification = (id) => api.delete(`/api/notifications/${id}`);

/** Legacy namespace kept for existing consumers. */
export const NotificationService = {
    getAll: getNotifications,
    markAsRead: markNotificationsRead,
};
