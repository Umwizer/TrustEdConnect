import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from './firebase';

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  role: string;
  photoURL?: string | null;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: any;
  createdAt: any;
  updatedAt: any;
  unreadCount: number;
  otherUser: UserProfile | null;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: any;
  read: boolean;
};
export type FirestoreConversation = {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: any;
  createdAt?: any;
  updatedAt?: any;
  unreadCounts?: Record<string, number>;
};
/**
 * Get a user's profile.
 *
 * New users should normally be stored in users/{uid}.
 *
 * The fallback collections allow this to work with users
 * that may already exist in teachers/{uid}, parents/{uid},
 * or admins/{uid}.
 */
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    return {
      uid,
      fullName: data.fullName || data.name || 'Unknown User',
      email: data.email || '',
      role: data.role || 'user',
      photoURL: data.photoURL || null,
    };
  }

  const collections = ['teachers', 'parents', 'admins'];

  for (const collectionName of collections) {
    const profileRef = doc(db, collectionName, uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      const data = profileSnap.data();

      return {
        uid,
        fullName: data.fullName || data.name || 'Unknown User',
        email: data.email || '',
        role: data.role || collectionName.slice(0, -1),
        photoURL: data.photoURL || null,
      };
    }
  }

  return null;
};

/**
 * Listen to all conversations belonging to a user.
 */
export const listenToConversations = (
  userId: string,
  onChange: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
) => {
  const conversationsRef = collection(db, 'conversations');

  const q = query(
    conversationsRef,
    where('participants', 'array-contains', userId)
  );

  return onSnapshot(
    q,
    async (snapshot) => {
      try {
        const conversations = await Promise.all(
          snapshot.docs.map(async (conversationDoc) => {
            const data = conversationDoc.data();

            const participants: string[] = data.participants || [];

            const otherUserId = participants.find(
              (participantId) => participantId !== userId
            );

            let otherUser: UserProfile | null = null;

            if (otherUserId) {
              otherUser = await getUserProfile(otherUserId);
            }

            return {
              id: conversationDoc.id,
              participants,
              lastMessage: data.lastMessage || '',
              lastMessageAt: data.lastMessageAt || null,
              createdAt: data.createdAt || null,
              updatedAt: data.updatedAt || null,
              unreadCount: data.unreadCounts?.[userId] || 0,
              otherUser,
            };
          })
        );

        conversations.sort((a, b) => {
          const timeA =
            a.lastMessageAt?.toMillis?.() ||
            a.updatedAt?.toMillis?.() ||
            0;

          const timeB =
            b.lastMessageAt?.toMillis?.() ||
            b.updatedAt?.toMillis?.() ||
            0;

          return timeB - timeA;
        });

        onChange(conversations);
      } catch (error) {
        console.error('Error loading conversations:', error);

        if (onError) {
          onError(error as Error);
        }
      }
    },
    (error) => {
      console.error('Conversation listener error:', error);

      if (onError) {
        onError(error);
      }
    }
  );
};

/**
 * Listen to all messages inside one conversation.
 */
export const listenToMessages = (
  conversationId: string,
  onChange: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
) => {
  const messagesRef = collection(
    db,
    'conversations',
    conversationId,
    'messages'
  );

  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: ChatMessage[] = snapshot.docs.map((messageDoc) => {
        const data = messageDoc.data();

        return {
          id: messageDoc.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text || '',
          createdAt: data.createdAt || null,
          read: data.read || false,
        };
      });

      onChange(messages);
    },
    (error) => {
      console.error('Message listener error:', error);

      if (onError) {
        onError(error);
      }
    }
  );
};

/**
 * Get one conversation.
 */
export const getConversation = async (
  conversationId: string
): Promise<FirestoreConversation | null> => {
  const conversationRef = doc(
    db,
    'conversations',
    conversationId
  );

  const snapshot = await getDoc(conversationRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    participants: data.participants || [],
    lastMessage: data.lastMessage || '',
    lastMessageAt: data.lastMessageAt || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    unreadCounts: data.unreadCounts || {},
  };
};
/**
 * Send a message and update the conversation.
 *
 * Both operations happen inside a Firestore transaction.
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  text: string
) => {
  const cleanText = text.trim();

  if (!cleanText) {
    return;
  }

  const conversationRef = doc(
    db,
    'conversations',
    conversationId
  );

  const messageRef = doc(
    collection(
      db,
      'conversations',
      conversationId,
      'messages'
    )
  );

  await runTransaction(db, async (transaction) => {
    const conversationSnapshot =
      await transaction.get(conversationRef);

    if (!conversationSnapshot.exists()) {
      throw new Error('Conversation does not exist.');
    }

    const conversationData = conversationSnapshot.data();

    const currentUnreadCounts =
      conversationData.unreadCounts || {};

    const receiverUnreadCount =
      currentUnreadCounts[receiverId] || 0;

    transaction.set(messageRef, {
      senderId,
      receiverId,
      text: cleanText,
      createdAt: serverTimestamp(),
      read: false,
    });

    transaction.update(conversationRef, {
      lastMessage: cleanText,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      unreadCounts: {
        ...currentUnreadCounts,
        [receiverId]: receiverUnreadCount + 1,
      },
    });
  });
};

/**
 * Mark the current user's conversation as read.
 */
export const markConversationAsRead = async (
  conversationId: string,
  userId: string
) => {
  const conversationRef = doc(
    db,
    'conversations',
    conversationId
  );

  await updateDoc(conversationRef, {
    [`unreadCounts.${userId}`]: 0,
  });
};

/**
 * Create a one-to-one conversation.
 *
 * The conversation ID is generated from the two user IDs,
 * so the same two users won't accidentally get multiple
 * conversations.
 */
export const createConversation = async (
  currentUserId: string,
  otherUserId: string
) => {
  const participants = [currentUserId, otherUserId].sort();

  const conversationId = participants.join('_');

  const conversationRef = doc(
    db,
    'conversations',
    conversationId
  );

  await setDoc(
    conversationRef,
    {
      participants,
      lastMessage: '',
      lastMessageAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      unreadCounts: {
        [currentUserId]: 0,
        [otherUserId]: 0,
      },
    },
    {
      merge: true,
    }
  );

  return conversationId;
};