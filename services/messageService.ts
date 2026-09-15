// services/messageService.ts
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface MessageData {
  id: string;
  senderId: string;
  recipientId: string;
  recipientName: string;
  content: string;
  isRead: boolean;
  createdAt: any;
}

export const getMyMessages = async (uid: string): Promise<MessageData[]> => {
  try {
    const snap = await getDocs(
      query(collection(db, 'messages'), where('recipientId', '==', uid))
    );
    return snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        senderId: d.senderId || '',
        recipientId: d.recipientId || '',
        recipientName: d.recipientName || '',
        content: d.content || '',
        isRead: d.isRead || false,
        createdAt: d.createdAt,
      };
    });
  } catch (error) {
    console.error('getMyMessages error:', error);
    return [];
  }
};

// ✅ SEND MESSAGE to a parent
export const sendMessage = async (params: {
  senderId: string;
  recipientId: string;
  recipientName: string;
  content: string;
}) => {
  return await addDoc(collection(db, 'messages'), {
    senderId: params.senderId,
    recipientId: params.recipientId,
    recipientName: params.recipientName,
    content: params.content.trim(),
    isRead: false,
    createdAt: serverTimestamp(),
  });
};