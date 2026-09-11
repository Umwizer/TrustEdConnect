import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from './firebase';

export type NotificationType =
  | 'message'
  | 'student'
  | 'teacher'
  | 'parent'
  | 'event'
  | 'attendance'
  | 'grade'
  | 'announcement'
  | 'system';

export type AppNotification = {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType | string;
  read: boolean;
  createdAt: any;
  relatedId?: string | null;
  relatedRoute?: string | null;
};

/**
 * Convert Firestore timestamp into milliseconds.
 */
const getNotificationTime = (createdAt: any): number => {
  if (!createdAt) {
    return 0;
  }

  if (typeof createdAt.toMillis === 'function') {
    return createdAt.toMillis();
  }

  if (createdAt instanceof Date) {
    return createdAt.getTime();
  }

  if (typeof createdAt === 'number') {
    return createdAt;
  }

  return 0;
};

/**
 * Listen to notifications belonging to the
 * currently authenticated user.
 *
 * This version does NOT use orderBy(),
 * so Firestore does not require a composite index.
 */
export const listenToNotifications = (
  userId: string,
  onChange: (notifications: AppNotification[]) => void,
  onError?: (error: Error) => void
) => {
  const notificationsRef = collection(
    db,
    'notifications'
  );

  const notificationsQuery = query(
    notificationsRef,
    where('recipientId', '==', userId)
  );

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const notifications: AppNotification[] =
        snapshot.docs.map((notificationDoc) => {
          const data = notificationDoc.data();

          return {
            id: notificationDoc.id,
            recipientId: data.recipientId || '',
            title: data.title || '',
            message: data.message || '',
            type: data.type || 'system',
            read: data.read === true,
            createdAt: data.createdAt || null,
            relatedId: data.relatedId || null,
            relatedRoute: data.relatedRoute || null,
          };
        });

      /**
       * Sort newest notifications first.
       */
      notifications.sort((a, b) => {
        const timeA = getNotificationTime(a.createdAt);
        const timeB = getNotificationTime(b.createdAt);

        return timeB - timeA;
      });

      onChange(notifications);
    },
    (error) => {
      console.error(
        'Notification listener error:',
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
};

/**
 * Mark one notification as read.
 */
export const markNotificationAsRead = async (
  notificationId: string
) => {
  const notificationRef = doc(
    db,
    'notifications',
    notificationId
  );

  await updateDoc(notificationRef, {
    read: true,
  });
};

/**
 * Mark all notifications belonging to
 * the current user as read.
 */
export const markAllNotificationsAsRead = async (
  userId: string,
  notifications: AppNotification[]
) => {
  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.read &&
        notification.recipientId === userId
    );

  if (unreadNotifications.length === 0) {
    return;
  }

  const batch = writeBatch(db);

  unreadNotifications.forEach(
    (notification) => {
      const notificationRef = doc(
        db,
        'notifications',
        notification.id
      );

      batch.update(notificationRef, {
        read: true,
      });
    }
  );

  await batch.commit();
};