import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
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
 * Register a new user
 */
export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  role: 'admin' | 'teacher' | 'parent',
  phone: string
) => {
  const cleanName = fullName.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();

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
    phone: cleanPhone,
    role: role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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
  const credential = GoogleAuthProvider.credential(
    idToken,
    accessToken
  );

  const result = await signInWithCredential(
    auth,
    credential
  );

  const user = result.user;

  /**
   * Create or update the user's profile
   * in Firestore.
   */
  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      fullName: user.displayName || 'User',
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
 * Send password reset email
 */
export const resetPassword = async (
  email: string
) => {
  return await sendPasswordResetEmail(
    auth,
    email.trim().toLowerCase()
  );
};

/**
 * Change the password of the currently
 * authenticated email/password user.
 */
export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      'No authenticated user found.'
    );
  }

  /**
   * Google-only users don't have an
   * email/password credential.
   */
  if (!user.email) {
    throw new Error(
      'This account does not have an email/password login.'
    );
  }

  /**
   * Create a credential using the
   * user's current email and password.
   */
  const credential =
    EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

  /**
   * Firebase requires the user to have
   * recently authenticated before changing
   * sensitive account information.
   */
  await reauthenticateWithCredential(
    user,
    credential
  );

  /**
   * Change the password.
   */
  await updatePassword(
    user,
    newPassword
  );
};