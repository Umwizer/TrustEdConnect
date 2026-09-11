// services/userService.ts
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import {
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  subject?: string;
  photoURL?: string;
}

export const getCurrentUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      uid: snap.id,
      fullName: d.fullName || '',
      email: d.email || '',
      role: d.role || 'teacher',
      phone: d.phone || '',
      subject: d.subject || '',
      photoURL: d.photoURL || '',
    };
  } catch (error) {
    console.error('getCurrentUserProfile error:', error);
    return null;
  }
};

// ✅ UPDATE PROFILE
export const updateUserProfile = async (
  uid: string,
  updates: { fullName?: string; phone?: string; subject?: string }
) => {
  // Update Firestore doc
  await updateDoc(doc(db, 'users', uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  // Also update Firebase Auth displayName
  if (updates.fullName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: updates.fullName });
  }
};

// ✅ SEND PASSWORD RESET EMAIL
export const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
};

// ✅ FIND ADMIN CONTACT
export const getAdminContact = async (): Promise<{
  fullName: string;
  email: string;
  phone: string;
} | null> => {
  try {
    const snap = await getDocs(
      query(collection(db, 'users'), where('role', '==', 'admin'))
    );
    if (snap.empty) return null;
    const d = snap.docs[0].data();
    return {
      fullName: d.fullName || 'School Admin',
      email: d.email || '',
      phone: d.phone || '',
    };
  } catch (error) {
    console.error('getAdminContact error:', error);
    return null;
  }
};