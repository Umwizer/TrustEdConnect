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
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from './firebase';

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );

  const user = userCredential.user;
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error('User record not found in database.');
  }

  const role = userDoc.data().role;
  return { user, role };
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  role: string = 'teacher'
) => {
  const cleanName = fullName.trim();
  const cleanEmail = email.trim().toLowerCase();

  const userCredential = await createUserWithEmailAndPassword(
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

export const loginWithGoogleCredential = async (
  idToken: string,
  accessToken?: string
) => {
  const provider = new GoogleAuthProvider();
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  const result = await signInWithCredential(auth, credential);
  const user = result.user;

  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  let role = 'teacher';

  if (userDoc.exists()) {
    role = userDoc.data().role;
  } else {
    await setDoc(userDocRef, {
      uid: user.uid,
      fullName: user.displayName || 'User',
      email: user.email || '',
      role: 'teacher',
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
    });
  }

  return { result, role };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email.trim().toLowerCase());
};