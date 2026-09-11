// services/eventService.ts
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  createdBy: string;
  description?: string;
}

export const getAllEvents = async (): Promise<EventData[]> => {
  try {
    const snap = await getDocs(collection(db, 'events'));
    return snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || '',
        date: d.date || '',
        time: d.time || '',
        location: d.location || '',
        createdBy: d.createdBy || '',
        description: d.description || '',
      };
    });
  } catch (error) {
    console.error('getAllEvents error:', error);
    return [];
  }
};

export const createEvent = async (params: {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  createdBy: string;
  createdByName: string;
}) => {
  return await addDoc(collection(db, 'events'), {
    title: params.title.trim(),
    date: params.date.trim(),
    time: params.time.trim(),
    location: params.location.trim(),
    description: params.description?.trim() || '',
    createdBy: params.createdBy,
    createdByName: params.createdByName,
    createdAt: serverTimestamp(),
  });
};