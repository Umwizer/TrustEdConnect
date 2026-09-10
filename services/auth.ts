import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from './firebase';

/**
 * Login with email and password
 */
export const loginUser = async (
  email: string,
  password: string
) => {
  return await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );
};

/**
 * Register a new teacher
 */
export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  role: 'admin' | 'teacher' | 'parent'
) => {
  const cleanName = fullName.trim();
  const cleanEmail = email.trim().toLowerCase();

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: cleanName,
  });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    fullName: cleanName,
    email: cleanEmail,
    role: role,
    createdAt: serverTimestamp(),
  });

  return userCredential;
};
/**
 * Sign in with Google credential
 */
export const loginWithGoogleCredential = async (
  idToken: string,
  accessToken?: string
) => {
  const provider = new GoogleAuthProvider();

  const credential = GoogleAuthProvider.credential(
    idToken,
    accessToken
  );

  const result = await signInWithCredential(
    auth,
    credential
  );

  const user = result.user;

  // Create/update teacher profile
  await setDoc(
    doc(db, 'teachers', user.uid),
    {
      uid: user.uid,
      fullName: user.displayName || 'Teacher',
      email: user.email || '',
      role: 'teacher',
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return result;
};

/**
 * Logout
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Password reset
 */
export const resetPassword = async (
  email: string
) => {
  return await sendPasswordResetEmail(
    auth,
    email.trim().toLowerCase()
  );
};