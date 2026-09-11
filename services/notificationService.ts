// services/notificationService.ts
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: any;
}

export const getMyNotifications = async (uid: string): Promise<NotificationData[]> => {
  try {
    const snap = await getDocs(
      query(collection(db, 'notifications'), where('recipientId', '==', uid))
    );
    return snap.docs
      .map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || '',
          message: d.message || '',
          type: d.type || 'info',
          isRead: d.isRead || false,
          createdAt: d.createdAt,
        };
      })
      .sort((a: any, b: any) => {
        const aT = a.createdAt?.seconds || 0;
        const bT = b.createdAt?.seconds || 0;
        return bT - aT;
      });
  } catch (error) {
    console.error('getMyNotifications error:', error);
    return [];
  }
};

export const getUnreadCount = async (uid: string): Promise<number> => {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'notifications'),
        where('recipientId', '==', uid),
        where('isRead', '==', false)
      )
    );
    return snap.size;
  } catch (error) {
    console.error('getUnreadCount error:', error);
    return 0;
  }
};

// ✅ SEND NOTIFICATION TO PARENT
export const notifyParent = async (params: {
  parentId: string;
  studentId: string;
  studentName: string;
  message: string;
  senderId: string;
  senderName: string;
}) => {
  return await addDoc(collection(db, 'notifications'), {
    recipientId: params.parentId,
    recipientRole: 'parent',
    studentId: params.studentId,
    studentName: params.studentName,
    title: `Alert about ${params.studentName}`,
    message: params.message,
    type: 'attention',
    senderId: params.senderId,
    senderName: params.senderName,
    isRead: false,
    createdAt: serverTimestamp(),
  });
};

// ✅ ALIAS — matches what the notification center uses
export const sendNotification = notifyParent;